export function SanitizeString(string, probihitedString = "/_PROBIHITED_STRING_/") {
  if (!probihitedString) {
    probihitedString = "/_PROBIHITED_STRING_/";
  }
  
  const originalString = string;
  const lowercaseString = string.toLowerCase();
  const lowercaseProhibitedString = probihitedString.toLowerCase();

  var sanitizedString = originalString;

  if(lowercaseString.includes("<script>")) {
    var scriptIndex = lowercaseString.indexOf("<script>");
    if(lowercaseString.includes("</script>")) {
      var scriptEndIndex = lowercaseString.indexOf("</script>") + 9;
      sanitizedString = originalString.substring(0, scriptIndex) + originalString.substring(scriptEndIndex);
    } else {
      sanitizedString = originalString.substring(0, scriptIndex) + originalString.substring(scriptIndex + 8);
    }
  }

  if(lowercaseString.includes(lowercaseProhibitedString)) {
    var prohibitedStringIndex = lowercaseString.indexOf(lowercaseProhibitedString);
    sanitizedString = originalString.substring(0, prohibitedStringIndex) + originalString.substring(prohibitedStringIndex + probihitedString.length);
  }

  return sanitizedString;
}