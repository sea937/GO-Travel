// 1. カテゴリ一覧を取得
const categories = ["すべて", ...new Set(Object.values(countryData).map(c => c.category))];

// 表示状態を管理
let currentCategory = "すべて";
let searchTerm = "";

// メイン描画関数
function render() {
    const app = document.getElementById('content');
    
    // フィルターされた国リスト
    const filtered = Object.entries(countryData).filter(([key, country]) => {
        const matchesCategory = currentCategory === "すべて" || country.category === currentCategory;
        const matchesSearch = country.name.includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    // HTML生成
    app.innerHTML = `
        <!-- カテゴリタブ -->
        <div class="flex flex-wrap gap-2 mb-6 justify-center">
            ${categories.map(cat => `
                <button onclick="setCategory('${cat}')" 
                    class="px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentCategory === cat ? 'bg-blue-600 text-white' : 'bg-white shadow-sm hover:bg-gray-50'}">
                    ${cat}
                </button>
            `).join('')}
        </div>
        
        <!-- 国リスト -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${filtered.map(([key, country]) => `
                <div class="bg-white p-4 rounded-xl shadow-sm border hover:border-blue-400 cursor-pointer transition" 
                     onclick="showDetail('${key}')">
                    <div class="text-4xl mb-2">${country.flag}</div>
                    <h3 class="font-bold text-gray-800">${country.name}</h3>
                </div>
            `).join('')}
        </div>
    `;
}

// カテゴリ変更処理
window.setCategory = (cat) => {
    currentCategory = cat;
    render();
};

// 検索処理
document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    render();
});

// 詳細表示
window.showDetail = (key) => {
    const c = countryData[key];
    
    // 各セクションを生成するヘルパー関数
    const renderSection = (title, content) => {
        if (!content) return "";
        let body = "";
        
        if (typeof content === 'object' && !Array.isArray(content)) {
            body = Object.entries(content).map(([k, v]) => `<li class="mb-1"><strong>${k}:</strong> ${v}</li>`).join('');
        } else if (Array.isArray(content)) {
            body = content.map(item => `<li class="mb-1">${item}</li>`).join('');
        } else {
            body = content;
        }
        
        return `
            <div class="bg-gray-50 p-4 rounded-xl">
                <h4 class="font-bold text-blue-800 border-b border-blue-200 mb-2 pb-1">${title}</h4>
                <ul class="text-sm text-gray-700 list-none pl-0">${body}</ul>
            </div>`;
    };

    document.getElementById('content').innerHTML = `
        <button onclick="render()" class="mb-4 text-blue-600 font-bold hover:underline">← 一覧に戻る</button>
        <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h2 class="text-4xl mb-6">${c.flag} ${c.name}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${renderSection("基本情報", c.info)}
                ${renderSection("ベストシーズン", c.season)}
                ${renderSection("費用目安", c.cost)}
                ${renderSection("SIM情報", c.sim)}
                ${renderSection("入国準備", c.entry)}
                ${renderSection("マナー・タブー", c.taboo)}
                ${renderSection("治安・緊急", c.security)}
                ${renderSection("観光地", c.spots)}
                ${renderSection("グルメ", c.gourmet)}
                ${renderSection("交通", c.transport)}
            </div>
        </div>
    `;
};

// 初期描画
render();
