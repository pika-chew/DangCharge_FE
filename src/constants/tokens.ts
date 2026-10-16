// Figma Variables 내보내기(design-tokens.json)에서 옮긴 값입니다. 수정할 때는 src/index.css의 @theme도 함께 바꿉니다.

export const primitiveColors = {
  purple: '#7257df',
  purpleDark: '#30275a',
  purpleTint: '#f0ecfc',
  white: '#ffffff',
  ink: '#19171f',
  gray: '#8d8797',
  grayLight: '#aaa3b1',
  canvas: '#fbfafc',
  border: '#e5e0eb',
  green: '#2c9b63',
  greenTint: '#eaf7f0',
} as const

export const semanticColors = {
  canvas: primitiveColors.canvas,
  surface: primitiveColors.white,
  brand: primitiveColors.purple,
  brandSubtle: primitiveColors.purpleTint,
  successSubtle: primitiveColors.greenTint,
  textPrimary: primitiveColors.ink,
  textSecondary: primitiveColors.gray,
  textTertiary: primitiveColors.grayLight,
  textOnBrand: primitiveColors.white,
  textBrand: primitiveColors.purple,
  textSuccess: primitiveColors.green,
  borderDefault: primitiveColors.border,
  borderBrand: primitiveColors.purple,
} as const

export interface TypographyToken {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
}

const fontFamily = 'Roboto'

export const typography = {
  display36: { fontFamily, fontSize: 36, fontWeight: 700, lineHeight: 44, letterSpacing: 0 },
  heading24: { fontFamily, fontSize: 24, fontWeight: 700, lineHeight: 32, letterSpacing: 0 },
  heading20: { fontFamily, fontSize: 20, fontWeight: 700, lineHeight: 28, letterSpacing: 0 },
  body14: { fontFamily, fontSize: 14, fontWeight: 400, lineHeight: 20, letterSpacing: 0 },
  body14Strong: { fontFamily, fontSize: 14, fontWeight: 700, lineHeight: 20, letterSpacing: 0 },
  label12: { fontFamily, fontSize: 12, fontWeight: 700, lineHeight: 16, letterSpacing: 0 },
  caption12: { fontFamily, fontSize: 12, fontWeight: 400, lineHeight: 16, letterSpacing: 0 },
} as const satisfies Record<string, TypographyToken>

// Tailwind 기본 간격 단위(4px)와 같아서 4·8·12·16·20·24·40px는 각각 1·2·3·4·5·6·10 유틸리티로 씁니다.
export const spacing = [4, 8, 12, 16, 20, 24, 40] as const

export const radius = {
  r14: 14,
  r18: 18,
  r26: 26,
} as const

export const shadows = {
  card: { offsetX: 0, offsetY: 18, blur: 60, spread: 0, color: '#30275a0f' },
} as const
