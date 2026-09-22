# 推送到 GitHub Pages（resume 独立项目）

目标：新建一个名为 `resume` 的普通仓库（不是 `<用户名>.github.io` 个人主页仓库），
发布后网址是 `https://<用户名>.github.io/resume/`。

站点文件已经准备好在本目录 `github-resume/` 里，全部是相对路径引用，放在子路径下不会有资源 404。

---

## 为什么不直接用现在这个仓库

当前仓库的 `origin` 指向 ChatGPT Sites 的托管地址
（`git.chatgpt-team.site/...`），并且站点文件在 `dist/` 子目录里。
GitHub Pages 的「从分支发布」只支持根目录或 `/docs`，不支持 `/dist`。

所以最干净的做法是：拿 `github-resume/` 这份扁平副本，新建一个独立仓库推上去。
原仓库保持不动，ChatGPT Sites 那边的发布流程不受影响。

---

## 步骤

### 1. 在 GitHub 上新建空仓库

打开 https://github.com/new

- Repository name：`resume`
- 可见性：**Public**（免费账户的 Pages 只对公开仓库生效）
- **不要**勾选 Add a README / .gitignore / license（保持空仓库，避免推送时冲突）

创建后记下地址，形如 `https://github.com/<用户名>/resume.git`

### 2. 初始化并推送

在 `github-resume` 目录里执行（把 `<用户名>` 换成你的 GitHub 用户名）：

```bash
cd github-resume
git init -b main
git add .
git commit -m "Add online resume site"
git remote add origin https://github.com/<用户名>/resume.git
git push -u origin main
```

第一次推送会弹出 GitHub 登录。如果要求密码，**填 Personal Access Token 而不是账号密码**：
GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) →
Generate new token，勾选 `repo` 权限，生成后复制粘贴当密码用。

（如果你本机装了 GitHub CLI，前两步可以合并成 `gh repo create resume --public --source=. --push`。）

### 3. 打开 Pages

仓库页面 → **Settings** → 左侧 **Pages**：

- Source：`Deploy from a branch`
- Branch：`main`，目录 `/ (root)`
- Save

等 1～2 分钟，页面顶部会出现 `Your site is live at https://<用户名>.github.io/resume/`。
首次发布偶尔要等到 3 分钟左右，可以在仓库 **Actions** 标签页看到 `pages build and deployment` 的进度。

### 4. 验证

- `https://<用户名>.github.io/resume/` 打开正常
- 主题切换按钮三态（跟随系统／浅色／深色）都工作
- 「下载 PDF」按钮能下载到 `resume.pdf`
- 手机上打开检查顶栏导航

---

## 以后怎么更新

改完 `dist/` 里的文件后，把改动同步到这份副本再推一次：

```bash
# 在 resume-site 根目录
cp dist/index.html dist/styles.css dist/content.css dist/site.js dist/media.js dist/resume.pdf github-resume/
cd github-resume
git add -A
git commit -m "Update resume"
git push
```

推送后 Pages 自动重新构建，通常半分钟内生效。
浏览器有缓存，看不到变化时用硬刷新（Ctrl+Shift+R）。

长期维护如果觉得两份文件麻烦，可以之后改成 GitHub Actions 从 `dist/` 直接发布，
这样就只需要维护一份源文件。需要的话我可以帮你配。

---

## 绑定自己的域名（可选）

1. 在 `github-resume/` 里新建文件 `CNAME`，内容只有一行你的域名，例如 `resume.example.com`
2. 域名服务商处加一条 CNAME 记录：`resume` → `<用户名>.github.io`
3. 回到 Settings → Pages，填入 Custom domain，勾选 Enforce HTTPS

注意：绑定自定义域名后，网址就不再带 `/resume/` 子路径了。

---

## 两个站点并存

GitHub Pages 和 ChatGPT Sites 可以同时挂着同一份内容，互不影响。
GitHub Pages 的好处是版本历史清晰、可以绑自己域名；
ChatGPT Sites 的好处是不用管构建。投递简历时给哪个链接都行。
