#!/bin/sh
echo "rm -rf \"${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/Contents/Resources/app\""
rm -rf "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/Contents/Resources/app"

echo "cp -RL \"${SRCROOT}/app\" \"${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/Contents/Resources/app\""
cp -RL "${SRCROOT}/app" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/Contents/Resources/app"
