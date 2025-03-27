import {
  downloadContentFromMessage,
  generateWAMessageContent,
  proto,
  toBuffer,
} from "@whiskeysockets/baileys";
import { createSticker, Exif } from "wa-sticker-formatter";
import { Bot } from "../interfaces/Bot";
// import { pvxgroups } from "../utils/constants";

// TODO: GLOBAL VARIALBES
let countSent = 0;
let countIn = 0;
let countErr = 0;
let sameSticker = 0;
// it will be better to store this record in db or file
const last20SentStickersSum = new Array<string>(50).fill("");

const forwardSticker = async (
  bot: Bot,
  downloadFilePath: proto.Message.IStickerMessage
): Promise<boolean> => {
  // console.log(JSON.stringify(downloadFilePath));
  delete downloadFilePath.contextInfo;
  // delete downloadFilePath.stickerSentTs;
  // console.log(JSON.stringify(downloadFilePath));

  try {
    const stickerChecksum = downloadFilePath.fileSha256
      ? Buffer.from(downloadFilePath.fileSha256).toString("hex")
      : "";

    if (last20SentStickersSum.includes(stickerChecksum)) {
      console.log("same sticker again.");
      sameSticker += 1;
      return false;
    }

    last20SentStickersSum.shift();
    last20SentStickersSum.push(stickerChecksum);
    countIn += 1;
    // const stream = await downloadContentFromMessage(
    //   downloadFilePath,
    //   "sticker"
    // );

    // const buffer = await toBuffer(stream);

    // const webpWithExif = await new Exif({
    //   pack: "BOT 🤖",
    //   author: "pvxcommunity.com",
    // }).add(buffer);

    // const stickerBuffer = await createSticker(buffer, {
    //   pack: "BOT 🤖",
    //   author: "pvxcommunity.com",
    // });

    // console.log(plaintext);
    // console.log(webpWithExif);

    console.log("STICKER!");

    // const bufferStream = new Readable();
    // bufferStream._read = () => {}; // _read is required, but we don't need to implement it
    // bufferStream.push(webpWithExif); // Push the buffer to the stream
    // bufferStream.push(null); // End the stream

    // const uploadedMedia = await bot.waUploadToServer(bufferStream, {
    //   mediaType: "sticker", // Media type (sticker in this case)
    // });

    // Create the plaintext node
    // const plaintextNode = {
    //   tag: "plaintext",
    //   attrs: {},
    //   content: { stickerMessage: webpWithExif },
    // };

    // Create the message node
    // const node = {
    //   tag: "message",
    //   attrs: {
    //     to: "120363417696270115@newsletter",
    //     type: "text",
    //   },
    //   content: [plaintextNode],
    // };

    const stickerChannel = "120363417696270115@newsletter";
    const testingChannel = "120363398801923614@newsletter";

    // downloadFilePath: proto.Message.IStickerMessage = {"url":"https://mmg.whatsapp.net/v/t62.15575-24/20114955_1268558591671875_2661400770449298109_n.enc?ccb=11-4&oh=01_Q5AaITkNWfmOo2ay9UShczqROHUoLX_kRWnl8AanI-X8Fk89&oe=680CC14E&_nc_sid=5e03e0&mms3=true","fileSha256":"2+jlTtrDhRkth3kI1GV244doPwYfFBkjaxZtmuJnmQI=","fileEncSha256":"diOsNG4yfGTd3M8Ei8D2uL4Z5M6sFJ51unHwJIby1pU=","mediaKey":"Gv6BsgpIfHnx4XBXG6Fql2yjBv+UtjllYVTNAqRFR8Q=","mimetype":"image/webp","directPath":"/v/t62.15575-24/20114955_1268558591671875_2661400770449298109_n.enc?ccb=11-4&oh=01_Q5AaITkNWfmOo2ay9UShczqROHUoLX_kRWnl8AanI-X8Fk89&oe=680CC14E&_nc_sid=5e03e0","fileLength":"80312","mediaKeyTimestamp":"1743086060","isAnimated":false,"stickerSentTs":"1743086060312","isAvatar":false,"isAiSticker":false,"isLottie":false}
    const plaintext = proto.Message.encode({
      stickerMessage: downloadFilePath,
    }).finish();

    // const msg = await generateWAMessageContent(
    //   { sticker: webpWithExif },
    //   {
    //     upload: bot.waUploadToServer,
    //   }
    // );
    // console.log("==============");
    // console.log(JSON.stringify(msg));
    // console.log("==============");

    // const plaintext2 = proto.Message.encode({
    //   stickerMessage: msg.stickerMessage,
    // }).finish();

    // https://github.com/nazedev/hitori/blob/554ebe6f24ef46ddcd9cd33e352f938e72ffabaf/src/message.js#L587

    await bot.query({
      tag: "message",
      attrs: {
        to: stickerChannel,
        type: "media",
      },
      content: [
        {
          tag: "plaintext",
          attrs: { mediatype: "sticker" },
          content: plaintext,
        },
      ],
    });
    // console.log(res);

    // const res1 = await bot.sendMessage("120363417696270115@newsletter", {
    //   sticker: webpWithExif, // Provide the sticker buffer here
    // });
    // console.log(res1);

    // 1000*60*60*24 = 86400ms = 1 day
    // await bot.sendMessage(
    //   pvxgroups.pvxstickeronly1,
    //   { sticker: webpWithExif },
    //   {
    //     ephemeralExpiration: 86400,
    //     mediaUploadTimeoutMs: 1000 * 60,
    //   }
    // );

    // await bot.sendMessage(
    //   pvxgroups.pvxstickeronly2,
    //   { sticker: webpWithExif },
    //   {
    //     ephemeralExpiration: 86400,
    //     mediaUploadTimeoutMs: 1000 * 60,
    //   }
    // );

    countSent += 1;
    console.log(
      `${countSent} sticker sent! In:${countIn}, Err:${countErr}, Same: ${sameSticker}`
    );
    return true;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.toString());
      // await loggerTg(`ERROR: [FORWARD-STICKER]\n${err.toString()}`);
    }
    countErr += 1;
    return false;
  }
};

export default forwardSticker;
