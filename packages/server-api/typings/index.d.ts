import { IMidwayKoaContext } from '@midwayjs/koa'

declare module '@midwayjs/koa' {
  interface Context extends IMidwayKoaContext {
    loginUser: {
      id: number
      name: string
    }
  }
}
