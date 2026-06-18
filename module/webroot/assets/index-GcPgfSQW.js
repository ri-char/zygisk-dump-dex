(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s);
  new MutationObserver((s) => {
    for (const n of s)
      if (n.type === "childList")
        for (const o of n.addedNodes)
          o.tagName === "LINK" &&
            o.rel === "modulepreload" &&
            i(o);
  }).observe(document, { childList: !0, subtree: !0 });

  function r(s) {
    const n = {};
    return (
      s.integrity && (n.integrity = s.integrity),
      s.referrerPolicy && (n.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (n.credentials = "omit")
        : (n.credentials = "same-origin"),
      n
    );
  }

  function i(s) {
    if (s.ep) return;
    s.ep = !0;
    const n = r(s);
    fetch(s.href, n);
  }
})();

let v = 0;
function L(t) {
  return `${t}_callback_${Date.now()}_${v++}`;
}

function w(t, e) {
  return (
    typeof e > "u" && (e = {}),
    new Promise((r, i) => {
      const s = L("exec");
      window[s] = (o, d, g) => {
        r({ errno: o, stdout: d, stderr: g }), n(s);
      };
      function n(o) {
        delete window[o];
      }
      try {
        ksu.exec(t, JSON.stringify(e), s);
      } catch (o) {
        i(o), n(s);
      }
    })
  );
}

function b(t) {
  ksu.toast(t);
}

const R = document.getElementById("app-template").content,
  h = document.getElementById("apps-list");

async function u(t) {
  const { errno: e, stdout: r, stderr: i } = await w(t);
  if (e !== 0) {
    b(`stderr: ${i}`);
    return;
  }
  return r;
}

// 排序：勾选的项排前面
function S() {
  [...h.children]
    .sort((t, e) => (t.querySelector('input[type="checkbox"]').checked ? -1 : 1))
    .forEach((t) => h.appendChild(t));
}

// 读取 `list.txt`
async function readIsolatedJson() {
  const data = await u("cat /data/adb/modules/dump_dex/list.txt");
  return data ? data.split("\n").filter(Boolean) : [];
}

// 写入 `list.txt`
async function writeIsolatedJson(packages) {
  const data = packages.length ? packages.join("\n") : "";
  await u(`echo '${data}' > /data/adb/modules/dump_dex/list.txt`);
}

const f = [];

function $(t, e) {
  const r = document.importNode(R, !0),
    i = r.querySelector("p");
  i.textContent = t;

  const s = r.querySelector('input[type="checkbox"]');
  s.checked = e;
  if (e) f.push(t);

  s.addEventListener("change", async () => {
    if (s.checked) {
      f.push(t);
    } else {
      const o = f.indexOf(t);
      if (o !== -1) f.splice(o, 1);
    }

    // 如果所有都取消，则清空 `list.txt`
    if (f.length === 0) {
      await writeIsolatedJson([]);
    } else {
      await writeIsolatedJson(f);
    }

    await p();
  });

  h.appendChild(r);
}

// 初始化数据
async function p() {
  await writeIsolatedJson(f);
}

// 加载应用列表
async function T() {
  const t = await u("pm list packages");
  if (t === void 0) return;

  const existingPackages = await readIsolatedJson();
  let r = existingPackages || [];

  const i = new Set(
    t
      .split("\n")
      .map((n) => n.split(":")[1])
      .filter(Boolean)
  );

  // 过滤无效包名
  const s = r.filter((n) => i.has(n));
  if (r.length !== s.length) {
    await writeIsolatedJson(s);
    r = s;
  }

  for (const n of i) {
    const o = r.includes(n);
    $(n, o);
  }

  S();
  
  document.getElementById("search").addEventListener("input", (n) => {
    const o = n.target.value.toLowerCase();
    [...h.children].forEach((d) => {
      const g = d.querySelector("p").textContent.toLowerCase();
      d.style.display = g.includes(o) ? "" : "none";
    });
  });
}

T();