import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import App from '../app/App'

describe('estrutura inicial', () => {
  it('renderiza o nome do jogo', () => {
    expect(renderToStaticMarkup(<App />)).toContain('Logic Quest')
  })
})
