import type { HTMLAttributes } from 'react';
import { ICON_MAP } from './names';
import type { IconfontName } from './names';

export type { IconfontName } from './names';

export interface IconProps extends HTMLAttributes<HTMLElement> {
  /** 图标语义 key，对应 ICON_MAP 中的键 */
  name: IconfontName;
  /** 覆盖字体大小（px 数字或任意 CSS 值），默认继承父级 */
  size?: number | string;
}

export default function Icon({ name, size, className, style, ...rest }: IconProps) {
  const sizeStyle = size != null ? { fontSize: typeof size === 'number' ? `${size}px` : size } : undefined;

  return (
    <i
      className={['iconfont', ICON_MAP[name], className].filter(Boolean).join(' ')}
      style={sizeStyle ? { ...sizeStyle, ...style } : style}
      aria-hidden="true"
      {...rest}
    />
  );
}
