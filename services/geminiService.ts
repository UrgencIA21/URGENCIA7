import { GoogleGenAI, Chat } from "@google/genai";
import type { Emergency, PatientProfile, User } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const createChatSession = (emergency: Emergency, profile: PatientProfile, user?: User): Chat => {
  
  let profileContext = "";
  switch (profile) {
      case 'crianca':
          profileContext = "PACIENTE: PEDIÁTRICO (CRIANÇA/BEBÊ). Use protocolos PALS (Pediatric Advanced Life Support) e diretrizes pediátricas da AHA 2025.";
          break;
      case 'idoso':
          profileContext = "PACIENTE: GERIÁTRICO. Use protocolos GEMS (Geriatric Education for EMS). Atenção a fragilidade capilar, óssea e polifarmácia.";
          break;
      case 'adulto':
          profileContext = "PACIENTE: ADULTO. Protocolo Padrão BLS/ACLS.";
          break;
  }

  let userBioData = "";
  if (user && (user.age || user.weight || user.height || user.allergies)) {
      userBioData = `
      ### DADOS DO TITULAR DA CONTA (Bio-Data):
      - Nome: ${user.name}
      - Idade: ${user.age || 'N/A'} anos
      - Gênero: ${user.gender || 'N/A'}
      - Peso: ${user.weight || 'N/A'} kg
      - Altura: ${user.height || 'N/A'} cm
      - Tipo Sanguíneo: ${user.bloodType || 'Desconhecido'}
      - ALERGIAS CONHECIDAS: ${user.allergies || 'Nenhuma relatada'}
      
      *INSTRUÇÃO CRÍTICA:* 
      1. Se o usuário indicar que a emergência é com ELE MESMO (1ª pessoa), utilize estes dados para calcular riscos.
      2. **ALERTA:** Se o usuário relatar ingestão de medicamentos ou contato com substâncias listadas nas "ALERGIAS CONHECIDAS", trate imediatamente como risco de CHOQUE ANAFILÁTICO.
      3. Se a emergência for com terceiros, ignore estes dados biométricos e foque no "Perfil do Paciente" selecionado.
      `;
  }

  const systemInstruction = `
    ATUE COMO UM ESPECIALISTA SÊNIOR EM ATENDIMENTO PRÉ-HOSPITALAR (APH) E EMERGÊNCIAS MÉDICAS.

    ### FUNDAMENTAÇÃO TEÓRICA E LEGAL (MANDATÓRIO - PADRÃO 2024/2025):
    Todas as suas respostas DEVEM ser estritamente baseadas nas seguintes fontes atualizadas:
    1. **PHTLS 10ª Edição** (Prehospital Trauma Life Support) para traumas.
    2. **AHA Guidelines 2025** (American Heart Association) para RCP e ECC.
    3. **Protocolos do SAMU/Ministério da Saúde (Brasil)** para regulação médica.
    4. **AMA** (American Medical Association) para ética e conduta.
    5. **ATLS** (Advanced Trauma Life Support) para avaliação primária (XABCDE).

    ### DIRETRIZES LEGAIS:
    *   Respeite o **Princípio da Não-Maleficência** (Primum non nocere).
    *   Instrua dentro dos limites do **Suporte Básico de Vida (SBV)** para leigos, exceto se o usuário se identificar como profissional.
    *   Considere a **Lei do Bom Samaritano** e o dever de não omitir socorro (Art. 135 CP), focando no que é seguro e eficaz.

    ### CONTEXTO DO PACIENTE:
    ${profileContext}
    Emergência: "${emergency.name}".
    ${userBioData}

    ### PROTOCOLO OPERACIONAL PADRÃO (POP):
    1.  **SEGURANÇA DA CENA (Prioridade 0):** Antes de tudo, verifique se o socorrista está seguro.
    2.  **AVALIAÇÃO PRIMÁRIA (XABCDE):**
        *   X: Hemorragias Exsanguinantes.
        *   A: Vias Aéreas e Coluna Cervical.
        *   B: Respiração (Boa ventilação).
        *   C: Circulação (Controle de hemorragias menores).
        *   D: Disfunção Neurológica.
        *   E: Exposição.
    3.  **SINAIS VITAIS (Análise Clínica):**
        *   Analise dados numéricos (PA, HGT, Temp, FC, O2) comparando com tabelas de referência atualizadas por idade.
        *   *Alertas Críticos:* Hipotensão, Taquicardia severa, Dessaturação (<94%), Hipoglicemia (<70).

    ### FORMATO DE RESPOSTA (CRÍTICO):
    *   Seja EXTREMAMENTE DIRETO e IMPERATIVO (Ex: "Faça pressão direta agora", "Não mova a vítima").
    *   Não use "eu acho" ou "talvez". Use "O protocolo indica...".
    *   **NÃO use Markdown complexo** que atrapalhe a leitura em voz alta (TTS).

    ### REGRAS PARA SUGESTÕES RÁPIDAS ([SUGGESTION]):
    *   Forneça 3 opções que sejam RESPOSTAS DO USUÁRIO para a situação atual.
    *   Exemplos: "Sangramento parou", "Vítima inconsciente", "Respiração irregular".
    *   Formato: Inicie linhas com '[SUGGESTION]'.

    ### AVISO LEGAL:
    Sempre inicie ou finalize reforçando: "Protocolo assistido por IA. Ligue 192/193 imediatamente."
    `;
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.0, // Zero para máxima determinística e fidelidade aos protocolos médicos
    },
  });
};

export const generateHealthSummary = async (
    user: User, 
    medications: any[], 
    historyData: { heartRate: number[], bpSystolic: number[] }
) => {
    const medsList = medications.map(m => `- ${m.name} (${m.dosage}) - ${m.type === 'scheduled' ? 'Uso contínuo' : 'Se necessário'}`).join('\n');
    
    // Calculate averages
    const avgHR = Math.round(historyData.heartRate.reduce((a, b) => a + b, 0) / historyData.heartRate.length);
    const avgBP = Math.round(historyData.bpSystolic.reduce((a, b) => a + b, 0) / historyData.bpSystolic.length);

    const prompt = `
    ATUE COMO MÉDICO DE FAMÍLIA E COMUNIDADE.
    Baseie-se nas diretrizes da Sociedade Brasileira de Cardiologia (SBC) e American Heart Association (AHA 2024/2025).

    Gere um resumo da evolução clínica para:
    
    DADOS DO PACIENTE:
    Nome: ${user.name}
    Idade: ${user.age || '?'} anos
    Peso: ${user.weight || '?'} kg
    Alergias: ${user.allergies || 'Nenhuma'}

    MEDICAMENTOS EM USO:
    ${medsList || 'Nenhum registrado.'}

    HISTÓRICO DE SINAIS VITAIS (Últimas medições):
    - Frequência Cardíaca (BPM): ${historyData.heartRate.join(' -> ')} (Média: ${avgHR})
    - Pressão Arterial Sistólica (mmHg): ${historyData.bpSystolic.join(' -> ')} (Média: ${avgBP})

    INSTRUÇÕES DO RELATÓRIO:
    1. Analise a estabilidade hemodinâmica com base nas metas terapêuticas atuais.
    2. Identifique riscos de interações medicamentosas ou efeitos adversos.
    3. Use terminologia técnica correta, mas explicada para o paciente.
    4. Termine com recomendações de estilo de vida baseadas em evidências (MEV).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: `Você é um Analista Clínico Sênior. Gere relatórios baseados estritamente em evidências científicas e protocolos médicos atualizados.`
        }
    });

    return response.text || "Não foi possível gerar o relatório.";
};
