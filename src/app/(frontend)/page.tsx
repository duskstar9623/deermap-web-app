/**
 * 首页
 */

import { getTeamMembers, getNews } from '@/lib/payload-client'

export default async function HomePage() {
  const teamMembers = await getTeamMembers()
  const news = await getNews(5)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="container-max text-center">
          <h1 className="mb-4 text-5xl font-bold">欢迎来到鹿图科技</h1>
          <p className="mb-8 text-xl">一站式科研服务平台</p>
          <button className="btn-primary">开始使用</button>
        </div>
      </section>

      {/* Services Overview */}
      <section className="container-max py-12">
        <h2 className="mb-8 text-3xl font-bold">我们的服务</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h3 className="mb-2 text-xl font-semibold">基础制图</h3>
            <p className="text-gray-600">
              标准化科研图表在线自助生成，实时出图，无需人工介入
            </p>
          </div>
          <div className="card">
            <h3 className="mb-2 text-xl font-semibold">个性化制图</h3>
            <p className="text-gray-600">复杂需求专属1v1定制服务，进化树、基因结构图等</p>
          </div>
          <div className="card">
            <h3 className="mb-2 text-xl font-semibold">论文服务</h3>
            <p className="text-gray-600">论文润色、排版、图表优化等专业化服务</p>
          </div>
          <div className="card">
            <h3 className="mb-2 text-xl font-semibold">生信分析</h3>
            <p className="text-gray-600">
              蛋白质、基因组、转录组、多组学等数据分析服务
            </p>
          </div>
          <div className="card">
            <h3 className="mb-2 text-xl font-semibold">科研咨询</h3>
            <p className="text-gray-600">付费专业化1v1科研咨询服务</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container-max">
            <h2 className="mb-8 text-3xl font-bold">核心团队</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member: any) => (
                <div key={member.id} className="card">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {news.length > 0 && (
        <section className="container-max py-12">
          <h2 className="mb-8 text-3xl font-bold">行业讯息</h2>
          <div className="space-y-4">
            {news.map((article: any) => (
              <div key={article.id} className="border-l-4 border-blue-600 bg-blue-50 p-4">
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
