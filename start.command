#!/bin/bash
# 双击这个文件启动本地服务，然后在 DSH 侧边浏览器或系统浏览器里打开下面的地址。
cd "$(dirname "$0")" || exit 1
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
echo "=================================================="
echo " 自己用（DSH 侧边浏览器 / Safari 都行）："
echo "   http://127.0.0.1:8000"
echo ""
echo " 发给朋友（同一个 WiFi 下）："
echo "   http://${IP:-你的局域网IP}:8000"
echo ""
echo " 注意：DSH 侧边浏览器只认 http/https，"
echo "       直接把 file:// 拖进去是打不开的，要用上面的地址。"
echo ""
echo " 关掉这个窗口（或按 Control+C）就停止服务。"
echo "=================================================="
/usr/bin/python3 -m http.server 8000 --bind 0.0.0.0
