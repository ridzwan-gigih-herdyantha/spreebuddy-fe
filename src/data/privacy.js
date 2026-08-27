export { legalEntity } from "@/data/legal";

export const privacyContent = {
  badge: "Privacy",
  title: "What we hold, and why",
  lead: "Written in plain language rather than legalese. If anything here is unclear, ask us and we will explain it properly.",
  updatedLabel: "Last updated",
};

export const privacySections = [
  {
    id: "collect",
    title: "What we collect",
    blocks: [
      {
        subtitle: "The details you give us",
        body: "When you create an account we store your name, username, email address and phone number. You can add a delivery address and a profile photo, and both are optional. Your password is never stored as you typed it.",
      },
      {
        subtitle: "What you do in the shop",
        body: "Your cart, your wishlist and your orders. An order keeps the product, the quantity, the price at the time, its status and when it changed.",
      },
      {
        subtitle: "Your conversations",
        body: "Messages you send the assistant and the replies it gives are saved to your account so you can pick a conversation back up later. You can delete a conversation at any time from Chat history.",
      },
      {
        subtitle: "Nothing about payments",
        body: "The shop has no payment step yet, so no card or bank details reach us at all.",
      },
    ],
  },
  {
    id: "why",
    title: "Why we hold it",
    blocks: [
      {
        body: "To run your account and keep you signed in. To show you your cart, wishlist and orders on whatever device you use next. To let the assistant answer with your own wishlist in mind when you ask it to. And to fulfil an order once you place one.",
      },
      {
        body: "We do not sell any of it, and we do not use it to build advertising profiles.",
      },
    ],
  },
  {
    id: "sharing",
    title: "Who else sees it",
    blocks: [
      {
        subtitle: "The AI provider",
        body: "The assistant runs on a model hosted by OpenRouter. When you send a message, that message and the recent part of the same conversation are sent to them so a reply can be generated. Your email, phone number and address are never part of what is sent.",
      },
      {
        subtitle: "File storage",
        body: "Profile photos are kept with Cloudflare R2 rather than on our own server, and are served through short-lived links.",
      },
      {
        subtitle: "Our staff",
        body: "Administrators can see customer accounts and orders in order to run the shop. They cannot read your conversations.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    blocks: [
      {
        body: "One cookie, named token, which keeps you signed in. It is set when you log in, cannot be read by scripts in the page, and expires after seven days. Signing out clears it.",
      },
      {
        body: "There are no advertising or analytics cookies on this site, and no third-party trackers.",
      },
    ],
  },
  {
    id: "keeping",
    title: "How long we keep it",
    blocks: [
      {
        body: "Your account details stay for as long as the account exists. Orders are kept as a record of what was bought. Conversations stay until you delete them.",
      },
    ],
  },
  {
    id: "choices",
    title: "What you can do",
    blocks: [
      {
        subtitle: "Change or correct anything",
        body: "Your name, username, email, phone, photo, address and password are all editable in Settings, and changes take effect straight away.",
      },
      {
        subtitle: "Delete a conversation",
        body: "Chat history lets you remove any conversation, along with its messages.",
      },
      {
        subtitle: "Close your account",
        body: "There is no self-service delete yet. Email us and we will remove your account and the data attached to it.",
      },
    ],
  },
  {
    id: "security",
    title: "Keeping it safe",
    blocks: [
      {
        body: "Passwords are hashed before they are stored, so nobody here can read yours. Traffic between your browser and the shop is encrypted. Sessions expire after seven days and have to be renewed by signing in again.",
      },
      {
        body: "No system is perfect. If you ever think something is wrong with your account, tell us early rather than late.",
      },
    ],
  },
];
