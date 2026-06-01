import type { Prisma } from "../../generated/prisma/client";

export interface StudentDiagnosis {
  diagnosis?: string;
  responsible?: string;
}

export interface CaseStudyInput {
  schoolClass?: string;
  responsibleName?: string;
  responsibleEmail?: string;
  referredBy?: string;
  diagnoses?: Prisma.InputJsonValue;
  informantName?: string;
  informantRelation?: string;
  informantEmail?: string;
  responsiblePhone?: string;
  informantPhone?: string;
  pregnancyHistory?: string;
  pregnancyType?: string;
  observations?: string;
  healthHistory?: string;
  walkingDevelopment?: string;
  speechDevelopment?: string;
  sphincterControl?: string;
  vision?: string;
  hearing?: string;
  sleep?: string;
  usesMedication: boolean;
  medicationName?: string;
  medicationAtSchool: boolean;
  feeding?: string;
  foodSelectivity: boolean;
  foodRestrictions?: string;
  bathroomIndependence?: string;
  dressing?: string;
  locomotion?: string;
  comprehensionLevel?: string;
  socialInteraction?: string;
  communicationTypes?: string[];
  specificInterest?: string;
  crisisRegulationStrategy?: string;
  priorityAreas?: string[];
  sensorySensitivity?: string[];
  attention?: string;
  frustrationTolerance?: string;
  commandUnderstanding?: string;
  classificationSkill?: string;
  seriationSkill?: string;
  spatialConcepts?: string;
  readingLevel?: string;
  mathReasoning?: string;
  learningStyle?: string;
  strengths?: string;
  difficulties?: string;
  currentSupports?: string;
  aeeOpinion?: string;
  suggestedAdaptations?: string;
  developmentStage?: string;
  comorbidities?: string[];
  crisisBehaviors?: string[];
  neurodivergentCharacteristics?: string[];
}
