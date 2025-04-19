import { kickEmoteRegex, urlRegex } from "../../../../utils/constants";

const rules = [
  {
    // Kick Emote Rule
    regexPattern: kickEmoteRegex,
    component: ({ groups: { id, name }, index }) => (
      <img
        key={`emote-${id}-${index}`}
        className="kickEmote emote"
        title={name}
        src={`https://files.kick.com/emotes/${id}/fullsize`}
        alt={name}
        loading="lazy"
      />
    ),
  },
  // {
  //   // 7TV Emote Rule
  //   component: ({}) => <img className="sevenTVEmote emote" src={`https://cdn.7tv.app/emote/${emoteData.id}/4x.webp`} />,
  // },
  {
    // URL rule
    regexPattern: urlRegex,
    component: (match) => (
      <a key={`link-${match.index}`} href={match[0]} target="_blank" rel="noreferrer">
        {match[0]}
      </a>
    ),
  },
];

export const MessageParser = ({ message }) => {
  const parts = [];
  let lastIndex = 0;
  let currentText = message.content;

  let allMatches = [];
  rules.forEach((rule) => {
    const matches = [...currentText.matchAll(rule.regexPattern)];
    matches.forEach((match) => {
      allMatches.push({
        match,
        rule,
      });
    });
  });

  allMatches.sort((a, b) => a.match.index - b.match.index);

  // handle matches in order
  allMatches.forEach(({ match, rule }) => {
    if (match.index > lastIndex) {
      parts.push(currentText.slice(lastIndex, match.index));
    }

    parts.push(rule.component(match));
    lastIndex = match.index + match[0].length;
  });

  // add remaining text
  if (lastIndex < currentText.length) {
    parts.push(<span key={`text-${message.id}`}>{currentText.slice(lastIndex)}</span>);
  }

  return parts;
};
