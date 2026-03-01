export interface Word {
  id: string
  set_id: string
  word: string
  definition: string
  definition_zh?: string
  example: string
  mastered: boolean
  created_at: string
}

export interface VocabularySet {
  id: string
  user_id: string
  title: string
  created_at: string
  words?: Word[]
}

export interface ImportWord {
  word: string
  definition: string
  definition_zh?: string
  example: string
}
