# TildaUpdater адаптированный под nginx
Проект поднимает сервис для интеграции с [Tilda API](https://help-ru.tilda.cc/api)

## Для запуска необходимо
1. Установить все зависимости
   ```cmd
   npm i
   ```

2. Создать файл с переменными окружения
   ```cmd
   cp .env.example .env
   ```
3. Открыть в тильде *Мои сайты → САЙТ → Настройки сайта → API*

4. Указать секретный ключ интеграции в ```.env```
   ```
   TILDA_SECRET_KEY=
   ```

5. На сайте тильды указать ссылку на скрипт (webhook url)
   ```md
   # default
   http://localhost:3001/update
   ```

6. Опубликовать страницы сайта тильды

7. После этого сервис создаст папку сайта c конфигурационным файлом для nginx
   ```
   ./projects/[your_project]/nginx-tilda.conf
   ```

8. Включаем конфиг сайта в общий конфиг nginx
   ```
   server {
    include /var/www/tilda_updater/projects/[your_project]/nginx-tilda.conf;
   }
   ```
9. Перезапускаем nginx
   ```
   sudo nginx -s reload
   ```

Каждый раз при публикации и обновлении сайта сервис создает в корне файл ```nginx.reload```, который сигнализирует о том, что необходимо перезагрузить nginx