module.exports = {
    title: '学而时习之',
    description: '个人学习博客',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', {rel: 'icon', href: '/img/qiyu.jpg'}], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: false // 代码块显示行号
    },
    themeConfig: {
        nav: [ // 导航栏配置
            {text:'主页',link:'/'},
            {text: '博文',
                // 这里title是顶部导航的名字,后面可以链接进我们doc文件夹下的对应模块
                items:[
                    {text:"博客相关知识",link:'/vuePress/'},
                    {text:"JavaSE基础知识",link:'/javaBasics/'},
                    {text:"Java框架知识",link:'/javaFramework/'},
                    {text:"技术书籍",link:'/book/'},
                    {text:"前端",link:'/js/'},
                    {text:"数据库知识",link:'/sql/'},
                    {text:"项目实战",link:'/projectPractice/'},
                    {text:"工作项目积累",link:'/projectNote/'},
                    {text:"记错本",link:'/faultNote/'},
                    {text:"php",link:'/php/'},
                    {text:"linux学习",link:'/linux/'},
                    {text:"git笔记",link:'/git/'},
                    {text:"中间件",link:'/middleware/'},
                    {text:"docker笔记",link:'/docker/'},
                    {text:"nginx笔记",link:'/nginx/'},
                    {text:"系统架构",link:'/systemArchitecture/'},
                ]
            },
            {text: '工具网站',items: [
                    {text:"postimages图床",link:'https://postimages.org'}
                ]},
        ],
        sidebar: {
            '/javaBasics/': [
                {
                    title: 'Java基础',
                    children:[
                        ['/javaBasics/集合框架/集合框架','集合框架知识'],
                        ['/javaBasics/核心技术卷I/字符串','字符串'],
                        ['/javaBasics/廖雪峰/Java-廖雪峰','廖雪峰博客学习'],
                    ]
                }
            ],
            '/javaFramework/': [
                {
                    title: 'springMVC',
                    children:[
                        ['/javaFramework/springMVC/7月11日','第一天'],
                        ['/javaFramework/springMVC/7月12日','第二天'],
                        ['/javaFramework/springMVC/7月14日','第三天'],
                        ['/javaFramework/springMVC/7月16日','第四天'],
                    ]
                },
                {
                    title: 'springCloud',
                    children:[
                        ['/javaFramework/springCloud/方志朋F版SpringCloud教程','方志朋F版SpringCloud教程'],
                    ]
                },
                {
                    title: 'mybatis',
                    children:[
                        ['/javaFramework/mybatis/mybatis-plus','MyBatis-Plus笔记'],
                    ]
                },
            ],
            '/vuePress/': [
                {
                    title: '博客相关知识',
                    children:[
                        ['/vuePress/侧边栏相关/sidebar','侧边栏配置'],
                    ]
                },
                {
                    title: '遇到的问题',
                    children:[
                        ['/vuePress/遇到的问题/技巧','写博文中可用到的技巧'],
                        ['/vuePress/遇到的问题/Invisible','不能显示博文'],
                        ['/vuePress/遇到的问题/部署','部署遇到的问题'],
                        ['/vuePress/遇到的问题/更新','更新博文时遇到的问题'],
                    ]
                }
            ],
            '/projectPractice/': [
                {
                    title: '码匠笔记',
                    children:[
                        ['/projectPractice/码匠笔记/所遇问题','记录所遇到的问题'],
                        ['/projectPractice/码匠笔记/day01','第一天'],
                        ['/projectPractice/码匠笔记/day02','第二天'],
                        ['/projectPractice/码匠笔记/day03','第三天'],
                        ['/projectPractice/码匠笔记/day04','第四天'],
                        ['/projectPractice/码匠笔记/day05','第五天'],
                        ['/projectPractice/码匠笔记/day06','第六天'],
                        ['/projectPractice/码匠笔记/day07','第七天'],
                        ['/projectPractice/码匠笔记/day08','第八天'],
                        ['/projectPractice/码匠笔记/day09','第九天'],
                    ]
                },
            ],
            '/sql/': [
                {
                    title: '数据库相关',
                    children:[
                        ['/sql/mysql/随笔随记','MySQL知识随笔'],
                        ['/sql/mysql/索引','MySQL索引'],
                        ['/sql/mysql/锁知识','MySQL锁'],
                    ]
                }
            ],
            '/projectNote/': [
                {
                    title: '项目积累经验',
                    children:[
                        ['/projectNote/Java/贷款项目','贷款项目积累的知识'],
                    ]
                }
            ],
            '/faultNote/': [
                {
                    title: '记错本',
                    children:[
                        ['/faultNote/牛客网/牛客网','牛客网刷题错误'],
                    ]
                }
            ],
            '/js/': [
                {
                    title: 'js',
                    children:[
                        ['/js/js/js基础笔记','js基础知识笔记'],
                        ['/js/js/js高级笔记','js高级知识笔记'],
                    ]
                },
                {
                    title: 'jquery',
                    children:[
                        ['/js/jquery/米斯特吴jquery','米斯特吴jquery'],
                    ]
                },
                {
                    title: '李炎恢',
                    children:[
                        ['/js/lyh/axios&mock','axios&mock学习笔记'],
                        ['/js/lyh/李炎恢vue工具篇','vue工具篇教程学习笔记'],
                        ['/js/lyh/李炎恢vue核心篇','vue核心篇教程学习笔记'],
                    ]
                }
            ],
            '/php/': [
                {
                    title: '米斯特吴PHP',
                    children:[
                        ['/php/米斯特吴PHP/day01','第一天'],
                    ]
                },
                {
                    title: '菜鸟教程PHP',
                    children:[
                        ['/php/noob/菜鸟教程笔记','菜鸟教程PHP笔记'],
                    ]
                },
            ],
            '/yumu/': [
                {
                    title: '公司框架使用',
                    children:[
                        ['/yumu/公司框架/新框架','新框架'],
                        ['/yumu/公司框架/老框架','老框架'],
                        ['/yumu/公司框架/2020开年新框架','2020框架'],
                        ['/yumu/公司框架/框架通用','框架通用'],
                        ['/yumu/公司框架/js相关','js相关'],
                    ]
                },
            ],
            '/linux/': [
                {
                    title: '实验楼linux学习',
                    children:[
                        ['/linux/实验楼/实验楼linux','实验楼linux'],
                    ]
                },
                {
                    title: 'linux问题排查',
                    children:[
                        ['/linux/问题/容量问题','系统容量问题'],
                    ]
                },
            ],
            '/book/': [
                {
                    title: '技术书籍',
                    children:[
                        ['/book/Java核心技术卷/Java核心技术卷1','Java核心技术卷1'],
                        ['/book/On-Java-8/On-Java-8','On-Java-8'],
                        ['/book/算法图解/算法图解','算法图解'],
                    ]
                }
            ],
            '/git/': [
                {
                    title: 'git笔记',
                    children:[
                        ['/git/git/git','git笔记'],
                    ]
                },
                {
                    title: 'svn笔记',
                    children:[
                        ['/git/svn/svn','svn笔记'],
                    ]
                },
            ],
            '/middleware/': [
                {
                    title: '中间件',
                    children:[
                        ['/middleware/rabbitmq/rabbitmq','rabbitmq笔记'],
                    ]
                }
            ],
            '/docker/': [
                {
                    title: 'docker笔记',
                    children:[
                        ['/docker/deploy/正式服部署完整项目','正式服务器部署项目'],
                    ]
                }
            ],
            '/nginx/': [
                {
                    title: 'nginx笔记',
                    children:[
                        ['/nginx/nginx/nginx','nginx笔记'],
                    ]
                }
            ],
            '/systemArchitecture/': [
                {
                    title: '系统架构',
                    children:[
                        ['/systemArchitecture/monomer/smart-doc','smart-doc笔记'],
                        ['/systemArchitecture/monomer/maven','maven笔记'],
                    ]
                }
            ],
        }, // 侧边栏配置
        sidebarDepth: 4, // 侧边栏显示2级
        lastUpdated: 'Last Updated',
    },
};
