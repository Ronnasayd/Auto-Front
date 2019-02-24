FROM node
RUN set -ex && apt-get update && \
yarn global add gulp-cli && \
yarn global add browser-sync
USER node
WORKDIR app
CMD bash gulp.sh
