import OpenAI from 'openai'

export class AIService {
  private openai: OpenAI
  constructor() {
    if (!process.env.OPENAI_API_KEY) throw new Error('API_KEY is required')
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  async generateSummary(text: string): Promise<string> {
    if (!text) throw new Error('Text is required for summary generation')
    const response = await this.openai.responses.create({
      model: 'gpt-4.1',
      input: `Summarize the following text in exactly 30 words or less:\n\n${text}`,
    })
    if (!response?.output_text) throw new Error('No summary generated')
    const summary = response?.output_text
    if (!summary) throw new Error('Empty summary received')
    return summary.trim()
  }
}
