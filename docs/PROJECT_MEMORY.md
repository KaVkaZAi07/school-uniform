# Project Memory: School Uniform Catalog

## 1. Цель проекта

Это мобильный сайт-витрина школьной формы для просмотра моделей родителями и школами. Главная задача сайта - быстро открываться на телефоне, красиво показывать карточки моделей и давать возможность открыть каждую карточку с галереей фото.

Публичный сайт:
https://kavkazai07.github.io/school-uniform/

GitHub репозиторий:
https://github.com/KaVkaZAi07/school-uniform.git

Рабочая папка:
`C:\Users\user\Desktop\school-uniform`

## 2. Техническое устройство

Проект полностью статический.

Основные файлы:
- `index.html` - весь сайт в одном файле: HTML, CSS и JavaScript.
- `images/` - фон и фото карточек.
- `media/` - видео-превью на главном экране.
- `README.txt` - короткая памятка.
- `docs/PROJECT_MEMORY.md` - эта подробная память.
- `docs/HANDOFF_PROMPT.md` - готовый промпт для другой модели.

Здесь нет сборщика, package.json, npm, React или backend. Сайт можно открыть как статический HTML, но для проверки путей лучше запускать локальный сервер.

## 3. Важные функции сайта

В `index.html` уже реализовано:
- первый экран с фоном `images/bg.webp`;
- переключатель "День / Ночь";
- два вертикальных видео-превью на главном экране из папки `media/`;
- каталог из 10 мест;
- активные карточки берутся из массива `MODELS`;
- неактивные места показываются как плейсхолдеры с номером и плюсом;
- детальная галерея карточки;
- полноэкранное открытие фото;
- свайпы вправо/влево;
- корректная история браузера для кнопки "Назад" на Android;
- WhatsApp-кнопка в карточке.

## 4. Текущие модели

Модели описаны в `index.html` в блоке:

```js
const MODELS=[
  ...
];
```

Текущее соответствие:
- `id:1` - 1-я карточка, фото `images/m1_*.webp`
- `id:2` - 2-я карточка, фото `images/m2_*.webp`
- `id:3` - 3-я карточка, фото `images/m3_*.webp`
- `id:4` - 4-я карточка, фото `images/m4_*.webp`
- `id:5` - 5-я карточка, фото `images/m5_*.webp`
- `id:6` - 6-я карточка, фото `images/m6_*.webp`

Всего на странице оставлено `const TOTAL=10;`, поэтому после 6 активных карточек еще остаются плейсхолдеры 7-10.

## 5. Главное правило добавления фото

Если пользователь говорит:
"Первые 5 фото добавь в 7 карточку, остальные 6-10 фото добавь в 8 карточку"

то делать так:

1. Первые 5 входных файлов сжать в:
   - `images/m7_01.webp`
   - `images/m7_02.webp`
   - `images/m7_03.webp`
   - `images/m7_04.webp`
   - `images/m7_05.webp`

2. Следующие 5 входных файлов сжать в:
   - `images/m8_01.webp`
   - `images/m8_02.webp`
   - `images/m8_03.webp`
   - `images/m8_04.webp`
   - `images/m8_05.webp`

3. В `index.html` добавить в `MODELS`:

```js
{id:7,title:"Название модели",photos:["images/m7_01.webp","images/m7_02.webp","images/m7_03.webp","images/m7_04.webp","images/m7_05.webp"]},
{id:8,title:"Название модели",photos:["images/m8_01.webp","images/m8_02.webp","images/m8_03.webp","images/m8_04.webp","images/m8_05.webp"]}
```

4. Первое фото (`mN_01.webp`) автоматически станет главным фото карточки.

## 6. Как сжимать фото

Цель: сохранить красивый вид на телефоне, но сделать маленький вес.

Обычно использовались настройки:
- формат: WebP;
- максимальная ширина: `900px`;
- качество: `70`;
- метод WebP: `6`;
- EXIF orientation нужно учитывать.

Пример Python-скрипта, который уже подходит проекту:

```python
from pathlib import Path
from PIL import Image, ImageOps

pairs = [
  (r"C:\path\input1.png", "images/m7_01.webp"),
  (r"C:\path\input2.png", "images/m7_02.webp"),
]

for src, dst in pairs:
    srcp, dstp = Path(src), Path(dst)
    if not srcp.exists():
        raise FileNotFoundError(srcp)
    im = ImageOps.exif_transpose(Image.open(srcp)).convert("RGB")
    w, h = im.size
    max_w = 900
    if w > max_w:
        im = im.resize((max_w, round(h * max_w / w)), Image.Resampling.LANCZOS)
    dstp.parent.mkdir(exist_ok=True)
    im.save(dstp, "WEBP", quality=70, method=6)
    print(dstp.name, (w, h), "->", im.size, dstp.stat().st_size)
```

В этой среде часто использовался Python:

```powershell
$py='C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
```

Если Pillow не найден, можно использовать доступный Python с Pillow или установить Pillow в локальную среду.

## 7. Как сжимать видео

Видео главного экрана лежат в `media/`:
- `media/hero-preview.mp4`
- `media/hero-preview-2.mp4`
- poster-файлы `.webp`

Ранее видео сжимались так:
- убрать звук;
- ширина около `320-360px`;
- `fps=18`;
- H.264 baseline;
- `-movflags +faststart`;
- CRF около `31`;
- poster в WebP.

Идея: видео должно быстро стартовать на мобильном интернете.

## 8. Локальная проверка

Запуск локального сервера:

```powershell
python -m http.server 4344 --bind 127.0.0.1
```

Проверка страницы и файлов:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4344/index.html
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4344/images/m7_01.webp
```

Ожидаемый статус: `200`.

Если запускал сервер через `Start-Process`, после проверки остановить его:

```powershell
Stop-Process -Id <PID> -Force
```

## 9. Деплой

Деплой идет через GitHub Pages из ветки `main`.

Обычный порядок:

```powershell
git status --short --branch
git add index.html images/m7_01.webp images/m7_02.webp ...
git commit -m "Add seventh catalog card"
git push origin main
```

После пуша проверить:

```powershell
gh run list --limit 1
```

Ожидаемый результат:
`completed success pages build and deployment`

Публичную ссылку давать с cache-busting параметром:

```text
https://kavkazai07.github.io/school-uniform/?v=<short_commit>
```

Например:

```text
https://kavkazai07.github.io/school-uniform/?v=eb10d76
```

## 10. Проверка продакшена

После деплоя обязательно проверить:

```powershell
$base='https://kavkazai07.github.io/school-uniform/'
Invoke-WebRequest -UseBasicParsing ($base+'?v=<commit>')
Invoke-WebRequest -UseBasicParsing ($base+'images/m7_01.webp?v=<commit>') -Method Head
```

Ожидаемый статус: `200`.

Если GitHub Pages долго отдает старую версию:
- подождать 1-2 минуты;
- проверить `gh run list --limit 1`;
- проверить `gh api repos/KaVkaZAi07/school-uniform/pages`;
- если Pages build завис или отменен, можно rerun через `gh run rerun <run_id>`.

## 11. Аккуратность при работе

Важно:
- не удалять чужие файлы;
- не делать `git reset --hard`;
- не менять дизайн без просьбы;
- не переименовывать уже существующие фото без необходимости;
- добавлять только нужные карточки;
- соблюдать порядок фото пользователя;
- первое фото набора всегда главное в каталоге;
- после деплоя всегда давать ссылку и commit hash.

## 12. Названия карточек

Если пользователь не дал точное название, можно выбрать короткое по содержимому первого фото.

Примеры текущих названий:
- "Жилет + юбка"
- "Жилет + юбка + галстук"
- "Жилет + юбка 40-56"
- "Костюм тройка для мальчиков"
- "Школьный бомбер для девочки"
- "Жилет + юбка + галстук 116-164"

Названия используются:
- в заголовке детальной карточки;
- в тексте WhatsApp-сообщения.

## 13. Готовый алгоритм для новой модели

Когда пользователь присылает 10 фото и говорит добавить первые 5 в одну карточку, остальные 5 в другую:

1. Проверить `git status`.
2. Определить номера карточек из запроса.
3. Сжать фото в `images/mN_01.webp...`.
4. Добавить объекты в `MODELS` в `index.html`.
5. Проверить, что все пути существуют.
6. Запустить локальный сервер и проверить `200` для HTML и всех новых фото.
7. `git add`, `git commit`, `git push`.
8. Дождаться GitHub Pages.
9. Проверить публичный HTML и новые файлы.
10. Ответить пользователю кратко: что добавлено, размеры, ссылка, commit.
