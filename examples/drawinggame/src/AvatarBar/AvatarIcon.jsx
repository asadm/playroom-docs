import React from "react";
import defaultImg from "./default-avatar.png";

export default function generateAvatarIcon({
  playerState,
  key,
  style,
  noDefault,
  defaultImage,
}) {
  var profile = playerState ? playerState.getState("profile") : false;
  style = style || {};
  if (profile) style["borderColor"] = profile.color;
  if (profile && profile.photo) {
    style["backgroundImage"] = `url(${profile.photo})`;
    style["backgroundSize"] = "contain";
  } else if (!noDefault) {
    if (defaultImage === "color" && profile) {
      style["background"] = profile.color;
    } else {
      style["backgroundImage"] = `url(${defaultImage || defaultImg})`;
    }
    style["backgroundSize"] = defaultImage ? "cover" : "contain";
  }
  return (
    <div
      key={key || (playerState ? playerState.id : "")}
      className="avatar-holder"
      style={style}
    ></div>
  );
}
