import { GenerativeAiService } from "../generative-ai/generative-ai.service";
import { GoogleGenerativeAiService } from "../generative-ai/google-generative-ai.service";
import { AI_SOURCE, SELF_BASE_URL } from "../../config/env";
import { AI_SOURCE_OPEN_AI } from "../../constants/ai-constants/ai-source";
import { ChatGptAiService } from "../generative-ai/chatgpt-generative-ai.service";
import {
  AiFeature,
  CaseStudy,
  StudentFile,
} from "../../generated/prisma/client";
import { StudentRepository } from "../student/student.repository";
import { StudentService } from "../student/student.service";
import { AssessmentRepository } from "./assessment.repository";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../constants/ai-constants/keys";
import jwt from "jsonwebtoken";
import { htmlToPdf } from "../../utils";
import { AssessmentHistoryRepository } from "../assessment-history/assessment-history.repository";
import { prisma } from "../../shared/prisma";
import { AuditLogService } from "../audit-report/audit-report.service";
import { CaseStudyRepository } from "../case-study/case-study.repository";

export class AssessmentService {
  private readonly generativeAiService: GenerativeAiService;
  private readonly studentRepo = new StudentRepository();
  private readonly caseStudyRepo = new CaseStudyRepository();
  private readonly assessmentRepo = new AssessmentRepository();
  private readonly assessmentHistoryRepo = new AssessmentHistoryRepository();
  private studentService: StudentService;

  constructor() {
    const auditLogService = new AuditLogService();
    this.generativeAiService =
      AI_SOURCE?.toLowerCase() === AI_SOURCE_OPEN_AI
        ? new ChatGptAiService(auditLogService)
        : new GoogleGenerativeAiService();
    this.studentService = new StudentService();
  }

  async listAssessments(studentId: string) {
    const assessments = await this.assessmentRepo.findByStudent(studentId);
    return assessments.map((a) => ({
      ...a,
      url: this.getTokenData(a.name, a.content),
    }));
  }

  async createAssessment(name: string, content: string, studentId: string) {
    await this.assessmentRepo.create(name, content, studentId);
    return this.getTokenData(name, content);
  }

  async updateAssessment(id: string, name?: string, content?: string) {
    await prisma.$transaction(async (tx) => {
      const oldAssessment = await this.assessmentRepo.findById(id);

      await this.assessmentHistoryRepo.create(oldAssessment.content, id, tx);
      const assessment = await this.assessmentRepo.update(
        id,
        name,
        content,
        tx,
      );

      return this.getTokenData(assessment.name, assessment.content);
    });
  }

  async downloadDocument(token: string) {
    const assessmentContent = this.decodeJwt(token);
    return htmlToPdf(assessmentContent);
  }

  decodeJwt(token: string): string {
    const { sub: data } = jwt.verify(token, PUBLIC_KEY) as {
      sub: string;
    };
    return data;
  }

  getTokenData(name: string, content: string) {
    const token = jwt.sign({ sub: content }, PRIVATE_KEY, {
      expiresIn: "1h",
      algorithm: "RS256",
    });
    return encodeURI(
      `${SELF_BASE_URL}/assessment/download/${token}/${name}.pdf`,
    );
  }

  async generateDoc(studentId: string, files: StudentFile[]): Promise<string> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new Error("Estudante não encontrado");
    }

    const lastCaseStudy = await this.caseStudyRepo.findByStudentId(studentId);
    if (!lastCaseStudy) {
      throw new Error("Estudo de caso não encontrado");
    }

    const systemInstruction = await this.getPromptForGenerateDoc(
      student.name,
      student.birthDate,
      lastCaseStudy,
      files
    );
    const response = await this.generativeAiService.generateText({
      contents: [],
      systemInstruction,
      feature: AiFeature.GENERATE_PAEE,
    });
    return response.text?.replace(/```html\n?/, "")?.replace(/```$/, "") || "";
  }

  private async getPromptForGenerateDoc(
    studentName: string,
    studentBirthDate: Date,
    studentInfo: CaseStudy,
    files: StudentFile[],
  ): Promise<string> {
    const documents = files.length ? await Promise.all(
      files.map(async (f) => await this.getFileBase64(f.url)),
    ) : [];
    return `Você é um assistente virtual cuja função é, a partir de dados que lhe forem passado sobre um determinado aluno diagnosticado com TEA, elaborar PAEE (Plano de Atendimento Educacional Especializadoum), que deverá conter tanto um Plano de Desenvolvimento Individual (PDI) quanto um Plano Educacional Individualizado (PEI - Documento pedagógico formal e obrigatório no Brasil).
    Você deve retornar diretamente o PAEE (nada de comentários antes como: "Aqui está o PEI solicitado", já retorne o PEI e só) em um formato html organizado para renderização de um documento.
    Os dados do aluno são: { Nome: ${studentName}, Data de Nascimento: ${studentBirthDate} informações: ${JSON.stringify(studentInfo)} }.${
      documents.length
        ? " Além de tudo isso, segue uma listagem de documentos relevantes para diagnósticos desse aluno em formato base64, separados por vírgula: "
        : ""
    } ${documents.length ? documents.join(', ') : ""}`;
  }

  private readonly getFileBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  };
}
