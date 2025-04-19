import processKickBadges from "./kick";
import process7TVBadges from "./7tv";

const processBadges = (badges, msgDiv, fullData) => {
  processKickBadges(badges, msgDiv, fullData);
  process7TVBadges(badges, msgDiv, fullData);
};

export default processBadges;
