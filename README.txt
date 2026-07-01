SCHOOL UNIFORM SITE
===================

Это статический сайт-каталог школьной формы.
Рабочая папка: C:\Users\user\Desktop\school-uniform
Публичная ссылка: https://kavkazai07.github.io/school-uniform/
GitHub репозиторий: https://github.com/KaVkaZAi07/school-uniform.git

Главные файлы:
- index.html - весь сайт: стили, верстка, каталог, галерея, логика свайпов.
- images/ - фото карточек и фон.
- media/ - видео главного экрана.
- docs/PROJECT_MEMORY.md - подробная память проекта для другой модели.
- docs/HANDOFF_PROMPT.md - готовый текст, который можно отправить другой модели.

Как устроены карточки:
- Модели описаны в index.html в массиве const MODELS.
- У каждой модели есть id, title и photos.
- Фото лежат в images и называются так: m5_01.webp, m5_02.webp и т.д.
- Первое фото в photos всегда становится главным фото карточки в каталоге.
- Номер модели равен номеру карточки: m5_* - 5-я карточка, m6_* - 6-я карточка.

Как добавлять новые фото:
1. Сжать входные PNG/JPG в WebP.
2. Назвать файлы images/mN_01.webp ... images/mN_05.webp, где N - номер карточки.
3. Добавить модель в index.html в массив MODELS:
   {id:N,title:"Название",photos:["images/mN_01.webp","images/mN_02.webp", ...]}
4. Проверить локально через python -m http.server.
5. Сделать git add, git commit, git push.
6. Проверить GitHub Pages и дать ссылку с ?v=<commit>.

Короткая команда локального сервера:
python -m http.server 4344 --bind 127.0.0.1

После пуша проверяй:
- gh run list --limit 1
- https://kavkazai07.github.io/school-uniform/?v=<commit>

Если передаешь папку другой модели, отправь ей текст из docs/HANDOFF_PROMPT.md.
