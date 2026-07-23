# Готовый текст для передачи другой модели

Скопируй и отправь другой модели этот текст вместе с папкой проекта:

```text
Ты работаешь с проектом `school-uniform` в папке `C:\Users\user\Desktop\school-uniform`.

Это статический сайт-каталог школьной формы на GitHub Pages:
https://kavkazai07.github.io/school-uniform/

Весь сайт находится в `index.html`. Фото лежат в `images/`, видео в `media/`.
Редактор цен находится в `admin.html`.
Подробная память проекта лежит в `docs/PROJECT_MEMORY.md` - сначала прочитай ее полностью.

Цены и описания хранятся в Supabase. Публичный сайт сначала читает их через
Cloudflare Worker:
https://school-uniform-catalog.imperia-obuvi-07.workers.dev/catalog

Worker находится в `cloudflare/catalog-proxy.js`, его конфигурация -
`wrangler.jsonc`. Не удаляй этот прокси: он нужен для мобильных операторов,
которые не пропускают `*.supabase.co`. Развертывание Worker выполняется командой
`npx.cmd --yes wrangler@latest deploy`.

Главное правило:
- карточки описаны в `index.html` во вложенных массивах `models` блока `CATEGORIES`.
- фото карточек называются `images/mN_01.webp`, `images/mN_02.webp` и т.д., где N - номер карточки.
- первое фото (`mN_01.webp`) всегда главное фото карточки в каталоге.
- если я присылаю 10 фото и говорю "первые 5 в 7 карточку, остальные в 8 карточку", значит:
  - первые 5 сжать и сохранить как `images/m7_01.webp` ... `images/m7_05.webp`;
  - следующие 5 сжать и сохранить как `images/m8_01.webp` ... `images/m8_05.webp`;
  - добавить объекты с `id:7` и `id:8` в `models` нужной категории `CATEGORIES`.

Как сжимать фото:
- формат WebP;
- максимальная ширина 900px;
- quality 70;
- method 6;
- сохранять порядок, который я дал.

После изменений:
1. Проверь локально через `python -m http.server`.
2. Убедись, что `index.html` и новые фото отдают статус 200.
3. Сделай `git add`, `git commit`, `git push origin main`.
4. Дождись успешного GitHub Pages deploy.
5. Проверь публичную ссылку и новые файлы.
6. В ответе дай ссылку вида `https://kavkazai07.github.io/school-uniform/?v=<commit>` и номер коммита.

Работай аккуратно: не меняй дизайн без просьбы, не удаляй существующие файлы, не делай git reset --hard.
```
