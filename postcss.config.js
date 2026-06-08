export default {
  plugins: {
    /* CSS 处理管道 */
    // vite 读取 CSS 文件 ->
    // tailwindcss 展开 @tailwind 指令，生成所有 utility CSS ->
    // autoprefixer 根据浏览器兼容性需求，自动添加必要的浏览器前缀，确保 CSS 在不同浏览器中正常工作
    tailwindcss: {},
    autoprefixer: {},
  },
}
