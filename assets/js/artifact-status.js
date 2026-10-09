(function () {
  const script = document.currentScript;
  const status = script && script.dataset.status;
  const config = {
    lowfi: {
      label: "低保真原型",
      detail: "仅用于结构和交互讨论",
      background: "#f5f3ff",
      border: "#c4b5fd",
      color: "#5b21b6"
    },
    exploration: {
      label: "设计探索",
      detail: "尚未进入当前方案",
      background: "#eff6ff",
      border: "#93c5fd",
      color: "#1d4ed8"
    },
    legacy: {
      label: "历史版本",
      detail: "已停止维护",
      background: "#fff7ed",
      border: "#fdba74",
      color: "#9a3412"
    }
  }[status];

  if (!config) return;

  const link = document.createElement("a");
  link.href = "catalog.html";
  link.setAttribute("aria-label", `${config.label}，${config.detail}。查看页面目录`);
  link.innerHTML = `<strong>${config.label}</strong><span>${config.detail}</span>`;
  Object.assign(link.style, {
    position: "fixed",
    zIndex: "2147483647",
    right: "16px",
    top: "16px",
    display: "grid",
    gap: "1px",
    padding: "8px 12px",
    border: `1px solid ${config.border}`,
    borderRadius: "10px",
    background: config.background,
    color: config.color,
    boxShadow: "0 6px 20px rgba(16,24,40,.12)",
    font: '12px/1.35 "HarmonyOS Sans SC","HarmonyOS Sans","PingFang SC",sans-serif',
    textDecoration: "none"
  });
  link.querySelector("strong").style.fontWeight = "600";
  link.querySelector("span").style.opacity = ".78";
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(link), { once: true });
})();
