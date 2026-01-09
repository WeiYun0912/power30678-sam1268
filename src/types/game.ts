export interface Card {
  id: number
  imageId: string
  imageSrc: string
  soundSrc: string
  isFlipped: boolean
  isMatched: boolean
}

export interface QTEEvent {
  time: number      // 秒數
  key: string       // 要按的鍵
  duration: number  // 反應時間（毫秒）
}

export type GameStage = 'menu' | 'memory' | 'qte' | 'drag' | 'whack' | 'minesweeper' | 'complete' | 'gameover'

export interface GameState {
  stage: GameStage
  score: number
  lives: number
}
