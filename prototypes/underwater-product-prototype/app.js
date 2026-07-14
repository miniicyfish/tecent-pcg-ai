const defaults = {
  endTitle: "你刚看完的，不止这一层",
  endSubtitle: "进入水下模式，发现正片之外的视角、暗线和未说出口的故事。",
  endCta: "换个角度再看一遍",
  mapTitle: "《好东西》本集探索图谱",
  mapSubtitle: "这些正片带过的片刻，还可以换个角度再看一遍。",
  eventTitle: "Livehouse 演出后",
  surfaceText: "演出结束，后台灯还没熄，小叶把手机扣下去。",
  depthText: "她改掉的不只是一句歌词，也是她对亲密关系的防御。",
  mapCta: "换个角度再看一遍"
};

const storageKey = "underwater-product-prototype-copy";
let copy = { ...defaults, ...readSavedCopy() };

const events = [
  {
    title: "Livehouse 演出后",
    status: "推荐 / 可进入",
    state: "active",
    image: "../../haodongxi/app/public/haodongxi/scenes/livehouse-backstage.png"
  },
  {
    title: "排练室改词",
    status: "待开放",
    state: "locked",
    image: "../../haodongxi/app/public/haodongxi/scenes/rehearsal-room.png"
  },
  {
    title: "楼道声音采样",
    status: "概念预览",
    state: "concept",
    image: "../../haodongxi/app/public/haodongxi/scenes/shanghai-compound-night.png"
  },
  {
    title: "铁梅家的餐桌",
    status: "待开放",
    state: "locked",
    image: "../../haodongxi/app/public/haodongxi/scenes/tiemei-dining-table.png"
  },
  {
    title: "胡医生约咖啡",
    status: "概念预览",
    state: "concept",
    image: "../../haodongxi/app/public/haodongxi/scenes/clinic-coffee.png"
  },
  {
    title: "上台前改词",
    status: "待开放",
    state: "locked",
    image: "../../haodongxi/app/public/haodongxi/scenes/backstage-before-show.png"
  }
];

function readSavedCopy() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function applyCopy() {
  document.querySelectorAll("[data-edit-key]").forEach((node) => {
    const key = node.dataset.editKey;
    if (copy[key]) node.textContent = copy[key];
  });
}

function renderEditor() {
  const wrap = document.getElementById("editorFields");
  wrap.innerHTML = "";
  Object.keys(defaults).forEach((key) => {
    const field = document.createElement("div");
    field.className = "field";
    const label = document.createElement("label");
    label.textContent = labelFor(key);
    const input = key.includes("Text") || key.includes("Subtitle") ? document.createElement("textarea") : document.createElement("input");
    input.value = copy[key] ?? defaults[key];
    input.dataset.key = key;
    input.rows = key.includes("Text") || key.includes("Subtitle") ? 3 : 1;
    input.addEventListener("input", () => {
      copy[key] = input.value;
      applyCopy();
    });
    field.append(label, input);
    wrap.appendChild(field);
  });
}

function labelFor(key) {
  const labels = {
    endTitle: "页面 1 主文案",
    endSubtitle: "页面 1 副文案",
    endCta: "页面 1 CTA",
    mapTitle: "页面 2 标题",
    mapSubtitle: "页面 2 副标题",
    eventTitle: "事件标题",
    surfaceText: "水面文案",
    depthText: "水下文案",
    mapCta: "页面 2 CTA"
  };
  return labels[key] || key;
}

function renderEvents() {
  const rail = document.getElementById("eventRail");
  rail.innerHTML = "";
  events.forEach((event, index) => {
    const node = document.createElement("button");
    node.className = `event-node ${event.state}`;
    node.type = "button";
    node.innerHTML = `
      <img class="event-thumb" src="${event.image}" alt="${event.title}" />
      <span class="node-pin"></span>
      <strong>${event.title}</strong>
      <small>${event.status}</small>
    `;
    node.addEventListener("click", () => selectEvent(index));
    rail.appendChild(node);
  });
}

function selectEvent(index) {
  const event = events[index];
  document.querySelectorAll(".event-node").forEach((node, i) => {
    node.classList.toggle("active", i === index);
  });
  document.getElementById("detailImage").src = event.image;
  document.getElementById("detailStatus").textContent = event.status;
  if (index === 0) {
    copy.eventTitle = defaults.eventTitle;
    copy.surfaceText = defaults.surfaceText;
    copy.depthText = defaults.depthText;
  } else {
    copy.eventTitle = event.title;
    copy.surfaceText = "正片里，这一刻只是被快速带过的生活现场。";
    copy.depthText = event.state === "locked" ? "该事件的水下内容待开放，视频中可作为产品空间展示。" : "这一段可以作为概念预览，展示未来从不同人物进入的可能性。";
  }
  applyCopy();
  renderEditor();
}

function navigate(target) {
  document.getElementById("screen-end").classList.toggle("screen-active", target === "end");
  document.getElementById("screen-map").classList.toggle("screen-active", target === "map");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "go-map") navigate("map");
  if (action === "go-end") navigate("end");
});

document.getElementById("saveEdits").addEventListener("click", () => {
  localStorage.setItem(storageKey, JSON.stringify(copy));
});

document.getElementById("resetEdits").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  copy = { ...defaults };
  applyCopy();
  renderEditor();
  selectEvent(0);
});

document.getElementById("editToggle").addEventListener("change", (event) => {
  document.body.classList.toggle("editing-off", !event.target.checked);
});

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  });
});

renderEvents();
applyCopy();
renderEditor();
selectEvent(0);
