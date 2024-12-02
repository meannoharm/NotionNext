# Config and setting

## Config

Sensitive information such as API keys and build-related config should be set directly in environment variables.

Refer to the `.env.example` file to modify the `.env` file.

You might need to upload it to your deployment platform, such as Vercel.

Config can be obtained through the function `getConfig`.

## Setting

Style control and toggle-type configuration stored in a Notion database as part of the config setup.

After making changes, refresh to see the effect.

Setting is obtained through the `useSettingStore` hook.