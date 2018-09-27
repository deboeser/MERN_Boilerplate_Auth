import { colorClasses } from "../common/colors";

const standardTagConfiguration = theme => ({
  textUnderlined: {
    textDecorationLine: "underline"
  },
  textBold: {
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: "uppercase"
  },
  textBigger: {
    fontSize: "1.25rem"
  },
  ...colorClasses("Light", 100, "backgroundColor"),
  ...colorClasses("", 700, "color")
});

export default standardTagConfiguration;
