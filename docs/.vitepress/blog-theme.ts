// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'

// 开启RSS支持（RSS配置）
// import type { Theme } from '@sugarat/theme'

// const baseUrl = 'https://sugarat.top'
// const RSS: Theme.RSSOptions = {
//   title: '粥里有勺糖',
//   baseUrl,
//   copyright: 'Copyright (c) 2018-present, 粥里有勺糖',
//   description: '你的指尖,拥有改变世界的力量（大前端相关技术分享）',
//   language: 'zh-cn',
//   image: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
//   favicon: 'https://sugarat.top/favicon.ico',
// }

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 开启RSS支持
  // RSS,

  // 文章默认作者名字，优先级低于单独在文章中设置的情况
  author: "XHAO",

  // 搜索
  // 默认开启pagefind离线的全文搜索支持（如使用其它的可以设置为false）
  // search: false,


  // markdown 图表支持（会增加一定的构建耗时）
  mermaid: true,

  // hotArticle，控制首页右侧的精选文章内容，其中精选的文章由 frontmatter:sticky 进行控制
  // 设置为 false 时，不展示 hotArticle
  hotArticle: {
    title: '🔥 精选文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无精选内容'
  },

  // homeTags 用于控制首页右侧的标签内容
  // 设置为 false 时，不展示
  // homeTags: false,
  // homeTags: {
  //   title: `标签`
  // },

  // home 用于设置首页的自定义内容
  // interface HomeBlog {
  //   name?: string
  //   motto?: string
  //   inspiring?: string
  //   pageSize?: number
  //   author?: string | boolean
  //   logo?: string | boolean
  //   /**
  //    * @default 'card'
  //    */
  //   avatarMode?: 'card' | 'split'
  //   /**
  //    * 首页数据分析卡片
  //    */
  //   analysis?: HomeAnalysis
  // },
  home: {
    name: 'XHAO',
    motto: 'XHAO的个人博客',
    inspiring: '基于 Vitepress 定制 🎨',
    pageSize: 6,
    author: 'XHAO',
    avatarMode: 'split',
    analysis: {
      articles: {
        title: ['博客文章', '月更新', '周更新']
      }
    },
  },

  // 页脚
  footer: {
    // message 字段支持配置为HTML内容，配置多条可以配置为数组
    // message: '下面 的内容和图标都是可以修改的噢（当然本条内容也是可以隐藏的）',
    copyright: 'MIT License | XHAO',
    // icpRecord: {
    //   name: '蜀ICP备19011724号',
    //   link: 'https://beian.miit.gov.cn/'
    // },
    // securityRecord: {
    //   name: '公网安备xxxxx',
    //   link: 'https://www.beian.gov.cn/portal/index.do'
    // },
  },

  // 主题色修改
  themeColor: 'vp-green',

  // Type: FormatShowDate 用于自定义日期显示。
  formatShowDate(date) {
    return new Date(date).toLocaleString()
  },
  // formatShowDate: {
  //   minutesAgo: ' minutes ago',
  // },

  // recommend 推荐文章的展示卡片
  //设置为 false 时，不展示
  // style 为 sidebar 时，展示类似默认主题的侧边栏
  // interface RecommendArticle {
  //   title?: string
  //   pageSize?: number
  //   nextText?: string
  //   /**
  //    * 是否展示当前正在浏览的文章在左侧
  //    * @default true
  //    */
  //   showSelf?: boolean
  //   /**
  //    * 自定义文章过滤
  //    */
  //   filter?: (page: Theme.PageData) => boolean
  //   /**
  //    * 自定义排序
  //    * @default 'date'
  //    */
  //   sort?: 'date' | 'filename' | ((a: Theme.PageData, b: Theme.PageData) => number)
  //   /**
  //    * 当没有推荐文章时的提示，设置为 false 则不展示
  //    * @default '暂无相关文章'
  //    */
  //   empty?: string | boolean
  //   /**
  //    * 设置推荐文章的展示风格
  //    * @default 'sidebar'
  //    */
  //   style?: 'card' | 'sidebar'
  //   /**
  //    * 是否在左侧显示日期
  //    * @default true
  //    */
  //   showDate?: boolean
  //   /**
  //    * 是否在左侧展示序号
  //    * @default true
  //    */
  //   showNum?: boolean
  // }
  recommend: {
    title: '🔍 相关文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无相关文章',
    style: 'card',
    sort: 'date',
    showDate: true,
    showNum: true
  },

  // 友链
  friend: [
    // {
    //   nickname: '粥里有勺糖',
    //   des: '你的指尖用于改变世界的力量',
    //   avatar:
    //     'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
    //   url: 'https://sugarat.top',
    // },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://vitepress.dev/vitepress-logo-large.webp',
      url: 'https://vitepress.dev/',
    },
  ],

  // 评论
  // 配置文章的评论，使用 giscus（由 GitHub Discussions 驱动的评论系统）
  // 访问 https://giscus.app/zh-CN 获取下述的参数
  comment: {
    type: 'giscus',
    options: {
      repo: 'Bairdl/my-blog',
      repoId: 'R_kgDOPDSFDQ',
      category: 'Announcements',
      categoryId: 'DIC_kwDOPDSFDc4CsJ4a',
      inputPosition: 'top'
    },
    mobileMinify: true
  },

  //  用于控制文章底部按钮，点击按钮会在按钮下方渲染一个自定义的html内容，例如可以用来做赞赏按钮，内置了 wechatPay 和 aliPay 两个图标，也可自定义图标(svg)。
  buttonAfterArticle: {
    openTitle: '点赞',
    closeTitle: '下次一定',
    // content: '<img src="https://img.cdn.sugarat.top/mdImg/MTY0Nzc1NTYyOTE5Mw==647755629193">',
    // icon: 'aliPay'
  },

  // 公告
  // 设置一个全局的公告弹窗，支持设置图片，文字，按钮，跳链
  // 公共已拆分为独立插件，详细配置和使用方法可以见插件文档：vitepress-plugin-announcement
  popover: {
    title: '公告',
    body: [
      // { type: 'text', content: '👇公众号👇---👇 微信 👇' },
      // {
      //   type: 'image',
      //   src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp'
      // },
      // {
      //   type: 'text',
      //   content: '欢迎大家加群&私信交流'
      // },
      // {
      //   type: 'text',
      //   content: '文章首/文尾有群二维码',
      //   style: 'padding-top:0'
      // },
      // {
      //   type: 'button',
      //   content: '作者博客',
      //   link: 'https://sugarat.top'
      // },
      // {
      //   type: 'button',
      //   content: '加群交流',
      //   props: {
      //     type: 'success'
      //   },
      //   link: 'https://theme.sugarat.top/group.html',
      // }
    ],
    duration: 0
  },

  // article 设置文章全局相关能力
  // interface ArticleConfig {
  //   readingTime?: boolean
  //   /**
  //    * 阅读时间分析展示位置
  //    * @default 'inline'
  //    */
  //   readingTimePosition?: 'inline' | 'newLine' | 'top'
  //   hiddenCover?: boolean
  //   /**
  //    * 文章分析数据展示标题
  //    */
  //   analyzeTitles?: ArticleAnalyzeTitles
  // }
  // interface ArticleAnalyzeTitles {
  //   /**
  //    * 字数：{{value}} 个字
  //    */
  //   topWordCount?: string
  //   /**
  //    * 预计：{{value}} 分钟
  //    */
  //   topReadTime?: string
  //   /**
  //    * {{value}} 个字
  //    */
  //   inlineWordCount?: string
  //   /**
  //    * {{value}} 分钟
  //    */
  //   inlineReadTime?: string
  //   /**
  //    * 文章字数
  //    */
  //   wordCount?: string
  //   /**
  //    * 预计阅读时间
  //    */
  //   readTime?: string
  //   /**
  //    * 本文作者
  //    */
  //   author?: string
  //   /**
  //    * 发布时间
  //    */
  //   publishDate?: string
  //   /**
  //    * 最近修改时间
  //    */
  //   lastUpdated?: string
  //   /**
  //    * 标签
  //    */
  //   tag?: string
  // }
  article: {
    /**
     * 是否展示文章的预计阅读时间
     */
    readingTime: true,
    /**
     * 是否隐藏文章页的封面展示
     */
    hiddenCover: false,
    /**
     * 阅读时间分析展示位置
     */
    readingTimePosition: 'inline',
    /**
     * 自定义一系列文案标题
     */
    // analyzeTitles: {
    //   inlineWordCount: '{{value}} word counts',
    //   inlineReadTime: '{{value}} min read time',
    //   wordCount: 'Total word count',
    //   readTime: 'Total read time',
    //   author: 'Author',
    //   publishDate: 'Published on',
    //   lastUpdated: 'Last updated on',
    //   tag: 'Tags',
    // }
  },

  // alert 设置一个全局的提示弹窗 (由 el-alert 驱动)
  // interface Alert {
  //   type: 'success' | 'warning' | 'info' | 'error'
  //   /**
  //    * 细粒度的时间控制
  //    * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
  //    * 配置改变时，会重新触发展示
  //    */
  //   duration: number

  //   title?: string
  //   description?: string
  //   closable?: boolean
  //   center?: boolean
  //   closeText?: string
  //   showIcon?: boolean
  //   html?: string
  // }
  alert: {
    type: 'success',
    title: '标配内容，这是一个不会自动关闭的弹窗',
    duration: -1,
    description: '每次打开都会展示，可通过 html 属性自定义这块内容',
    showIcon: true
  }
})

export { blogTheme }
