import { GenerativeAiService } from "../generative-ai/generative-ai.service";
import { GoogleGenerativeAiService } from "../generative-ai/google-generative-ai.service";
import { AiFeatures } from "../../constants/ai-constants/ai-features";
import { GenerateTextResponse } from "../generative-ai/dto/generate-text-response";
import { AI_SOURCE, SELF_BASE_URL } from "../../config/env";
import { AI_SOURCE_OPEN_AI } from "../../constants/ai-constants/ai-source";
import { ChatGptAiService } from "../generative-ai/chatgpt-generative-ai.service";
import { StudentFile } from "../../generated/prisma/client";
import { StudentRepository } from "../student/student.repository";
import { StudentService } from "../student/student.service";
import { AiProviders } from "../../constants/ai-constants/ai-providers";
import { AssessmentRepository } from "./assessment.repository";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../constants/ai-constants/keys";
import jwt from 'jsonwebtoken';
import { markdownToPdf } from "../../utils";

export class AssessmentService {
  private readonly generativeAiService: GenerativeAiService;
  private readonly studentRepo = new StudentRepository();
  private readonly assessmentRepo = new AssessmentRepository();
  private studentService: StudentService;

  constructor() {
    this.generativeAiService =
      AI_SOURCE?.toLowerCase() === AI_SOURCE_OPEN_AI
        ? new ChatGptAiService()
        : new GoogleGenerativeAiService();
    this.studentService = new StudentService();
  }

  async listAssessments(studentId: string) {
    const assessments = await this.assessmentRepo.findByStudent(studentId);
    return assessments.map(a => ({ ...a, url: this.getTokenData(a.name, a.content)}));
  }

  async createAssessment(name: string, content: string, studentId: string) {
    await this.assessmentRepo.create(name, content, studentId);
    return this.getTokenData(name, content);
  }

  async updateAssessment(id: string, name?: string, content?: string) {
    const assessment = await this.assessmentRepo.update(id, name, content);
    return this.getTokenData(assessment.name, assessment.content);
  }

  async downloadDocument(token: string) {
    const assessmentContent = this.decodeJwt(token);
    return markdownToPdf(assessmentContent);
  }

  decodeJwt(token: string): string {
    const { sub: data } = jwt.verify(token, PUBLIC_KEY) as {
      sub: string;
    };
    return data;
  }

  getTokenData(name: string, content: string) {
    const token = jwt.sign({ sub: content }, PRIVATE_KEY, {
      expiresIn: '1h',
      algorithm: 'RS256',
    });
    return encodeURI(`${SELF_BASE_URL}/assessment/download/${token}/${name}.pdf`);
  }

  async generateDoc(files: StudentFile[]): Promise<string> {
    const studentId = "de437eef-aa92-4dbe-99ff-b1615e8b5127"; //files[0].studentId;
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new Error("Estudante não encontrado");
    }

    const systemInstruction = await this.getPromptForGenerateDoc(
      student.name,
      studentId,
    );
    const response = await this.generativeAiService.generateText({
      contents: [],
      systemInstruction,
      feature: AiFeatures.GENERATE_PAEE,
    });
    return response.text || "";
  }

  private async getPromptForGenerateDoc(
    studentName: string,
    studentId: string,
  ): Promise<string> {
    const example =
      "Esse aluno tem 15 anos e no momento encontra-se no nono ano. Ele possui hiperfoco em baleias e tem problemas com barulhos altos. O seu nível de autismo encontra-se entre os níveis 1 e 2";
    // return `Você é um assistente virtual cuja função é, a partir de documentos como laudos, diagnósticos e avaliações de um aluno com TEA, informar qual a melhor forma de trabalhar os assuntos com esse aluno (cujo nome é ${studentName}). Aqui estão as urls de acesso aberto dos documentos, separados por vírgula, em relação a essa criança`;
    return `Você é um assistente virtual cuja função é, a partir de dados que lhe forem passado sobre um determinado aluno diagnosticado com TEA, elaborar um Plano Educacional Individualizado(PEI - Documento pedagógico formal e obrigatório no Brasil).
    Você deve retornar diretamente o PEI (nada de comentários antes como: "Aqui está o PEI solicitado", já retorne o PEI e só) na forma de Markdown para renderização de um documento.
    Os dados do aluno são: { Nome: ${studentName}, informações: ${example}`;
  }

  private readonly downloadFile = async (url: string): Promise<Buffer> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };
}
