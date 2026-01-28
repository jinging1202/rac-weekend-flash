import React, { useState, useEffect, useRef, useMemo } from 'react';

// 配置常量
const WECHAT_WORK_URL = "https://work.weixin.qq.com/kfid/kfc3dbd2c4dc22c9e4f";

const CATEGORIES = [
  { id: 'global', name: 'GLOBAL', nameCN: '国际资讯', icon: '🌍', color: 'bg-yellow-300' },
  { id: 'education', name: 'EDU', nameCN: '教育动态', icon: '📚', color: 'bg-green-300' },
  { id: 'university', name: 'UNI', nameCN: '院校官网', icon: '🏛️', color: 'bg-blue-400 text-white' },
  { id: 'design', name: 'DESIGN', nameCN: '设计趋势', icon: '🎨', color: 'bg-red-500 text-white' },
  { id: 'summer', name: 'SUMMER', nameCN: '暑期科研', icon: '☀️', color: 'bg-orange-400 text-white' },
  { id: 'competitions', name: 'COMP', nameCN: '竞赛资讯', icon: '🏆', color: 'bg-purple-400 text-white' }
];

// 生成模拟新闻数据
const generateMockNews = () => {
  const news = [];
  let idCounter = 1;
  const weekOffset = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();

  const templates = {
    global: [
      { title: "AI Act in EU: How it affects creative industries.", titleCN: "欧盟AI法案：如何影响创意产业", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
      { title: "Apple Vision Pro adoption rates skyrocket in design studios.", titleCN: "Apple Vision Pro 在设计工作室的采用率飙升", url: "https://www.apple.com/apple-vision-pro/" },
      { title: "Climate change architecture symposium held in Rotterdam.", titleCN: "鹿特丹举办气候变化建筑研讨会", url: "https://www.archdaily.com/tag/climate-change" },
      { title: "Global remote work visa policies updated for digital nomads.", titleCN: "全球数字游民远程工作签证政策更新", url: "https://nomadlist.com/digital-nomad-visas" },
      { title: "NFT market crash: What's next for digital artists?", titleCN: "NFT市场崩盘：数字艺术家的下一步是什么？", url: "https://techcrunch.com/tag/nfts/" }
    ],
    education: [
      { title: "RCA announces new Digital Fashion MA program.", titleCN: "RCA 皇家艺术学院宣布新的数字时尚硕士课程", url: "https://www.rca.ac.uk/news-and-events/" },
      { title: "Parsons faculty strike ends with new curriculum agreement.", titleCN: "帕森斯教职工罢工结束，达成新课程协议", url: "https://www.newschool.edu/parsons/news/" },
      { title: "UK Student Visa fees increase by 15% effective immediately.", titleCN: "英国学生签证费用即日起上涨15%", url: "https://www.gov.uk/student-visa" },
      { title: "Comparison of Art School ROI: US vs UK vs Europe.", titleCN: "艺术院校投资回报率比较：美国 vs 英国 vs 欧洲", url: "https://www.qs.com/rankings/" },
      { title: "New generative AI tools integrated into Architectural Association courses.", titleCN: "新的生成式AI工具整合进AA建筑联盟学院课程", url: "https://www.aaschool.ac.uk/publicprogramme/whatson" }
    ],
    university: [
      { title: "UCL Bartlett releases 2026 admissions guidelines.", titleCN: "UCL 巴特莱特建筑学院发布2026招生指南", url: "https://www.ucl.ac.uk/bartlett/news" },
      { title: "Harvard GSD opens applications for Summer research fellows.", titleCN: "哈佛GSD开放暑期研究员申请", url: "https://www.gsd.harvard.edu/news/" },
      { title: "Politecnico di Milano ranks #1 in Design for 3rd year.", titleCN: "米兰理工大学连续三年设计类排名第一", url: "https://www.polimi.it/en/news" },
      { title: "Central Saint Martins degree show dates announced.", titleCN: "中央圣马丁毕业展日期公布", url: "https://www.arts.ac.uk/colleges/central-saint-martins/stories" },
      { title: "RISD creates new scholarship for international students.", titleCN: "RISD 罗德岛设计学院为国际学生设立新奖学金", url: "https://www.risd.edu/news" }
    ],
    design: [
      { title: "Interaction Design Trend: No-UI interfaces gaining traction.", titleCN: "交互设计趋势：无UI界面正在兴起", url: "https://uxdesign.cc/" },
      { title: "Sustainable materials: Mycelium bricks in modern housing.", titleCN: "可持续材料：现代住房中的菌丝体砖", url: "https://materialdistrict.com/" },
      { title: "UX/UI salaries in London vs Shanghai: 2025 Report.", titleCN: "伦敦 vs 上海 UX/UI 薪资：2025年报告", url: "https://www.glassdoor.com/Salaries/index.htm" },
      { title: "Why Industrial Design is merging with Biology.", titleCN: "为什么工业设计正在与生物学融合", url: "https://www.dezeen.com/design/" },
      { title: "Game Design: Unreal Engine 6 preview at GDC.", titleCN: "游戏设计：GDC上的虚幻引擎6预览", url: "https://www.unrealengine.com/en-US/blog" }
    ],
    summer: [
      { title: "AA Visiting School: Amazon Jungle Architecture workshop.", titleCN: "AA 访校：亚马逊丛林建筑研讨会", url: "https://www.aaschool.ac.uk/academicprogrammes/visitingschool" },
      { title: "Pratt Institute Summer Intensive: Visual Communication.", titleCN: "普瑞特艺术学院暑期强化班：视觉传达", url: "https://www.pratt.edu/continuing-and-professional-studies/precollege/" },
      { title: "CSM Summer: Experimental Typography in London.", titleCN: "CSM 暑期课程：伦敦实验排版", url: "https://www.arts.ac.uk/colleges/central-saint-martins/short-courses/summer-school" },
      { title: "Berkeley Summer Sessions: Urban Planning & Social Justice.", titleCN: "伯克利暑期课程：城市规划与社会正义", url: "https://summer.berkeley.edu/" },
      { title: "Parsons Paris: Fashion Management Summer Course.", titleCN: "帕森斯巴黎：时尚管理暑期课程", url: "https://www.newschool.edu/parsons-paris/summer-programs/" }
    ],
    competitions: [
      { title: "Red Dot Award 2026: Call for entries open.", titleCN: "2026红点奖：报名开启", url: "https://www.red-dot.org/" },
      { title: "eVolo Skyscraper Competition winners announced.", titleCN: "eVolo 摩天大楼竞赛获奖者公布", url: "https://www.evolo.us/" },
      { title: "D&AD New Blood Awards: Briefs released.", titleCN: "D&AD 新血奖：简报发布", url: "https://www.dandad.org/en/d-ad-new-blood-awards/" },
      { title: "IF Design Student Award deadline extended.", titleCN: "IF 设计新秀奖截止日期延长", url: "https://ifdesign.com/en/if-design-student-award" },
      { title: "Adobe Creative Jam: UI/UX Challenge for students.", titleCN: "Adobe Creative Jam：面向学生的 UI/UX 挑战赛", url: "https://www.adobe.com/education.html" }
    ]
  };

  CATEGORIES.forEach(cat => {
    for (let i = 0; i < 5; i++) {
      const template = templates[cat.id][i];
      const date = new Date(now.getTime() - Math.random() * weekOffset);
      const imgUrl = `https://picsum.photos/seed/${idCounter * 123}/800/500`;

      news.push({
        id: idCounter,
        category: cat.id,
        title: template.title,
        titleCN: template.titleCN,
        summary: `核心关键词：${cat.nameCN} | 趋势 | 变革。这是一段关于 ${template.titleCN} 的AI生成摘要。重点在于分析该事件对全球设计教育及留学生的影响。`,
        fullContent: `
          <div class="space-y-6">
            <div>
              <p class="font-bold text-gray-500 mb-2 font-mono text-xs">REPORT DATE: ${date.toLocaleDateString()} / LOCATION: GLOBAL</p>
              <h4 class="font-black text-xl mb-3">ENGLISH BRIEF</h4>
              <p class="mb-4 text-lg leading-relaxed">This development signals a significant shift in the ${cat.name} sector. Experts suggest that students preparing portfolios should pay close attention to these emerging trends.</p>
              <p class="mb-4">For applicants targeting top-tier institutions like RCA, UAL, or Ivy League schools, incorporating understanding of this topic could be a differentiator.</p>
              <ul class="list-disc pl-5 mb-4 space-y-2 text-sm text-gray-700">
                <li>Impact on 2026 admissions criteria.</li>
                <li>New skillsets required: AI collaboration, sustainable material usage.</li>
              </ul>
            </div>
            
            <div class="border-t-2 border-black border-dashed"></div>
            
            <div class="bg-gray-100 p-5 border-l-4 border-black">
              <h4 class="font-black text-xl mb-3 flex items-center gap-2">
                <span class="text-red-500">●</span> 中文深度解读
              </h4>
              <p class="mb-4"><strong>标题：</strong>${template.titleCN}</p>
              <p class="mb-4 text-justify">针对 ${template.titleCN} 这一事件，RAC 教研组认为这标志着 ${cat.nameCN} 领域的一次重要转折。对于正在准备作品集的同学来说，理解这一趋势背后的逻辑至关重要。</p>
              <p class="mb-2 font-bold">关键影响：</p>
              <ul class="list-disc pl-5 mb-4 space-y-2 text-sm text-gray-800">
                <li><strong>招生风向标：</strong>2026年及以后的申请可能会更看重学生对该话题的批判性思考。</li>
                <li><strong>技能要求升级：</strong>建议在项目中展现对 AI 协作流程或可持续材料的实际应用能力。</li>
                <li><strong>职业前景：</strong>具备此类跨学科背景的毕业生在国际就业市场上将更具竞争力。</li>
              </ul>
            </div>
            <p class="mt-4 italic text-sm border-t-2 border-dashed border-gray-400 pt-4">Source: Simulated Global News Network / Official University Press.</p>
          </div>
        `,
        analysis: `【RAC专家犀利点评】\n针对"${cat.nameCN}"板块的这一更新，我们强烈建议申请26Fall的同学在作品集中增加相关比重。这不仅是技术层面的更新，更是设计思维的迭代。切勿盲目跟风，要结合自身背景进行差异化竞争。`,
        tags: [cat.nameCN, '2026趋势', '热门话题'],
        url: template.url,
        image: imgUrl,
        date: date.toISOString()
      });
      idCounter++;
    }
  });

  return news.sort((a, b) => a.id - b.id);
};

// 标签组件
const Tag = ({ text, invert = false }) => (
  <span className={`inline-block border-2 border-black px-2 py-0.5 text-xs font-mono mr-2 mb-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${invert ? 'bg-black text-white' : 'bg-white text-black'}`}>
    #{text}
  </span>
);

// 侧边栏组件
const Sidebar = ({ isOpen, onClose, activeCategory, onSelectCategory }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />}
    <div className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white border-r-4 border-black z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
      <div className="p-4 border-b-4 border-black bg-black text-white flex justify-between items-center">
        <span className="font-black text-xl italic">MENU / 菜单</span>
        <button onClick={onClose} className="text-white text-2xl font-bold">✕</button>
      </div>
      
      <div className="p-6">
        <div className="mb-8">
          <h3 className="font-mono font-bold text-gray-400 mb-4 border-b-2 border-gray-300 pb-1">SECTIONS / 分类</h3>
          <button onClick={() => { onSelectCategory('all'); onClose(); }}
                  className={`block w-full text-left font-black text-xl mb-4 hover:text-red-500 transition-colors ${activeCategory === 'all' ? 'text-red-500 underline' : 'text-black'}`}>
            ALL NEWS (全部)
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { onSelectCategory(cat.id); onClose(); }}
                    className={`block w-full text-left font-bold text-lg mb-4 hover:text-red-500 transition-colors ${activeCategory === cat.id ? 'text-red-500 underline' : 'text-black'}`}>
              <span className="block font-black text-xl uppercase">{cat.icon} {cat.name}</span>
              <span className="text-sm font-normal text-gray-600">{cat.nameCN}</span>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="font-mono font-bold text-gray-400 mb-4 border-b-2 border-gray-300 pb-1">ARCHIVES / 归档</h3>
          <div className="space-y-3 font-mono font-bold opacity-50">
            <div className="flex justify-between items-center">
              <span>JAN 2026 (1月)</span>
              <span>🔒</span>
            </div>
            <div className="flex justify-between items-center">
              <span>DEC 2025 (12月)</span>
              <span>🔒</span>
            </div>
            <div className="flex justify-between items-center">
              <span>NOV 2025 (11月)</span>
              <span>🔒</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-300 border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <h4 className="font-bold text-sm mb-2">NEED HELP? / 遇到问题？</h4>
          <p className="text-xs mb-3 font-mono">Book a session with our portfolio experts.<br/>预约作品集专家咨询。</p>
          <a href={WECHAT_WORK_URL} className="block w-full bg-black text-white text-center py-2 font-bold text-xs hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-all">
            CONTACT SUPPORT / 联系客服
          </a>
        </div>
      </div>
    </div>
  </>
);

// 新闻卡片组件
const NewsCard = ({ item, onClick, categoryColor }) => (
  <div onClick={onClick}
       className="bg-white border-4 border-black p-0 mb-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer overflow-hidden group flex flex-col h-full">
    <div className="relative h-48 w-full overflow-hidden border-b-4 border-black bg-gray-200">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105" loading="lazy" />
      <div className={`absolute top-0 left-0 ${categoryColor} px-3 py-1 border-r-4 border-b-4 border-black font-black text-sm tracking-tighter`}>
        #{String(item.id).padStart(2, '0')}
      </div>
    </div>
    <div className="p-4 flex-grow flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap mb-3 gap-1">
          {item.tags.slice(0, 2).map((t, i) => <Tag key={i} text={t} />)}
        </div>
        <h3 className="font-black text-xl leading-tight mb-1 uppercase hover:text-blue-600 line-clamp-2">{item.title}</h3>
        <h4 className="font-bold text-sm text-gray-800 mb-3 line-clamp-2 border-l-4 border-yellow-300 pl-2">{item.titleCN}</h4>
        <p className="text-sm text-gray-600 font-mono line-clamp-2 leading-tight">{item.summary.split('。')[0]}...</p>
      </div>
      <div className="mt-4 pt-3 border-t-2 border-black flex justify-between items-center">
        <span className="text-xs font-bold bg-black text-white px-2 py-0.5">{item.date.split('T')[0]}</span>
        <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-black flex items-center justify-center group-hover:bg-yellow-300 transition-colors">
          <span className="text-white group-hover:text-black font-bold">→</span>
        </div>
      </div>
    </div>
  </div>
);

// 详情弹窗组件
const DetailModal = ({ item, onClose, categoryColor }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-200 bg-opacity-95 backdrop-blur-sm flex justify-center">
      <div className="bg-white w-full max-w-2xl h-full md:h-[90vh] md:my-auto md:border-4 md:border-black md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col overflow-hidden">
        
        <div className="bg-white border-b-4 border-black flex justify-between items-center p-3 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-1 border-2 border-black font-black text-sm ${categoryColor}`}>
              {item.category.toUpperCase()}
            </span>
            <span className="font-mono font-bold text-gray-500">#{String(item.id).padStart(2, '0')}</span>
          </div>
          <button onClick={onClose} className="bg-black text-white border-2 border-transparent hover:bg-red-500 hover:border-black transition-colors px-3 py-1 font-bold">
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto overflow-x-hidden bg-white">
          <div className="relative w-full h-56 md:h-72 border-b-4 border-black shrink-0">
            <img src={item.image} className="w-full h-full object-cover" alt="Detail" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
          
          <div className="p-5 md:p-8">
            <div className="mb-6 border-b-4 border-black pb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((t,i) => <Tag key={i} text={t} invert />)}
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase leading-none tracking-tight mb-2">{item.title}</h1>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{item.titleCN}</h2>
              <div className="flex items-center text-xs font-mono text-gray-500 mt-2">
                <span>🕐 PUBLISHED: {item.date.split('T')[0]}</span>
                <span className="mx-2">|</span>
                <span>⏱️ READ TIME: 2 MIN</span>
              </div>
            </div>

            <div className="prose-neo font-mono text-black mb-10" dangerouslySetInnerHTML={{ __html: item.fullContent }} style={{
              '& h3': { fontWeight: 900, textTransform: 'uppercase', borderBottom: '3px solid black', paddingBottom: '4px', marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.25rem' },
              '& p': { marginBottom: '1rem', lineHeight: 1.6, fontSize: '1rem' },
              '& strong': { backgroundColor: '#FFDE59', padding: '0 4px' }
            }} />

            <a href={item.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center w-full border-2 border-black py-4 font-black text-lg bg-gray-100 hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-10 group">
              🔗 READ ORIGINAL SOURCE / 阅读原文 ↗
            </a>

            <div className="relative mb-12 mx-1">
              <div className="absolute inset-0 bg-black transform translate-x-2 translate-y-2" />
              <div className="relative bg-yellow-300 border-4 border-black p-0 overflow-hidden">
                <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-500 rounded-full p-1 border border-white">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    <span className="font-bold tracking-wider">RAC INSIGHT</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="p-5" style={{ backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(#000 1px, transparent 1px)' }}>
                  <div className="bg-white border-2 border-black p-4 shadow-sm" style={{ transform: 'rotate(1deg)' }}>
                    <div className="flex items-start gap-4 mb-3 border-b-2 border-dashed border-gray-300 pb-3">
                      <div className="w-12 h-12 bg-gray-200 border-2 border-black rounded-full overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=RACExpert${item.id}&backgroundColor=transparent`} alt="Expert" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg leading-none mb-1">RAC 资深导师</h4>
                        <span className="text-xs font-mono text-gray-500 uppercase">Portfolio Strategy Director</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-black leading-relaxed whitespace-pre-line text-justify">
                      {item.analysis}
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs font-mono font-bold mb-2 uppercase tracking-widest">Does this affect your application?</p>
                    <span className="text-2xl animate-bounce inline-block">↓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t-4 border-black p-4 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-black font-bold text-sm bg-gray-100 hover:bg-gray-200 active:scale-95 transition-transform">
            CLOSE / 关闭
          </button>
          <a href={WECHAT_WORK_URL} className="flex-[2] py-3 border-2 border-black font-bold text-sm bg-red-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2">
            💬 立即咨询专家 (1v1)
          </a>
        </div>
      </div>
    </div>
  );
};

// 主应用
export default function RACWeekendFlash() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setNewsData(generateMockNews());
      setLoading(false);
    }, 1500);
  }, []);

  const filteredNews = useMemo(() => {
    return newsData.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.titleCN.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [newsData, activeCategory, searchQuery]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setNewsData(generateMockNews());
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20 relative bg-gray-200">
      
      {/* 跑马灯 */}
      <div className="bg-black text-white font-mono text-sm py-2 border-b-4 border-red-500 sticky top-0 z-30 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          RAC WEEKEND FLASH /// DESIGN EDUCATION /// GLOBAL TRENDS /// UPDATE: {new Date().toLocaleDateString()} /// AI GENERATED CONTENT /// CLICK TO CONSULT /// 
          RAC WEEKEND FLASH /// DESIGN EDUCATION /// GLOBAL TRENDS /// UPDATE: {new Date().toLocaleDateString()} /// AI GENERATED CONTENT /// CLICK TO CONSULT /// 
        </div>
      </div>

      {/* 头部 */}
      <div className="p-4 bg-white border-b-4 border-black">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1 border-2 border-black hover:bg-black hover:text-white transition-colors text-2xl">
              ☰
            </button>
            <h1 className="text-4xl font-black italic tracking-tighter">RAC<span className="text-red-500">FLASH</span></h1>
          </div>
          <div className="flex gap-2">
            <button onClick={refreshData} className="p-2 border-2 border-black bg-green-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all" title="Refresh">
              🔄
            </button>
          </div>
        </div>
        
        <div className="relative">
          <input type="text" placeholder="SEARCH TRENDS... / 搜索资讯..." value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-gray-200 border-2 border-black p-3 pl-10 font-mono focus:outline-none focus:bg-white focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all" />
          <div className="absolute left-3 top-3.5 text-gray-500">🔍</div>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="overflow-x-auto whitespace-nowrap p-4 bg-white border-b-4 border-black sticky top-[42px] z-20 shadow-lg">
        <button onClick={() => setActiveCategory('all')}
                className={`inline-flex items-center px-4 py-2 border-2 border-black mr-3 font-bold text-sm transition-all transform hover:-translate-y-1 ${activeCategory === 'all' ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}>
          ALL
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center px-4 py-2 border-2 border-black mr-3 font-bold text-sm transition-all transform hover:-translate-y-1 ${activeCategory === cat.id ? `${cat.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]` : 'bg-white hover:bg-gray-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}>
            <span className="mr-2">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="p-4 min-h-screen">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4" />
            <p className="font-mono text-sm animate-pulse">AI AGENT CRAWLING DATA... / 获取数据中...</p>
            <p className="text-xs text-gray-500">Retrieving from Global Sources</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map(item => (
                <NewsCard key={item.id} item={item} onClick={() => setSelectedItem(item)}
                         categoryColor={CATEGORIES.find(c => c.id === item.category)?.color} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 font-mono text-gray-500">
                NO DATA FOUND IN THIS SECTOR.
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 pt-8 border-t-4 border-gray-300 text-center text-xs font-mono text-gray-500 pb-20">
          <p>POWERED BY GEMINI AI & RAC STUDIO</p>
          <p>© 2026 RAC WEEKEND FLASH. ALL RIGHTS RESERVED.</p>
        </div>
      </div>

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)}
                                   categoryColor={CATEGORIES.find(c => c.id === selectedItem.category)?.color} />}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} 
               activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {/* 底部CTA */}
      {!selectedItem && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t-4 border-black p-3">
          <a href={WECHAT_WORK_URL}
             className="flex items-center justify-between bg-red-500 text-white border-2 border-black px-4 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-none">RAC 顾问在线</span>
              <span className="text-[10px] font-mono opacity-90">STUDY ABROAD CONSULTING</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-black px-2 py-1 animate-pulse">1v1 FREE</span>
              💬
            </div>
          </a>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee::after {
          content: ' RAC WEEKEND FLASH /// DESIGN EDUCATION /// GLOBAL TRENDS /// UPDATE: ${new Date().toLocaleDateString()} /// AI GENERATED CONTENT /// CLICK TO CONSULT /// ';
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
