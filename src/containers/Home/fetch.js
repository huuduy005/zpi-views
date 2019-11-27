import semver from "semver";
import request from "../../utils/request";

function getBranch(branch) {
  return branch === "master" ? "release" : branch;
}

export function getSpa(branch) {
  return request(
    `/api/${getBranch(branch)}/package.json`
  ).then(res => {
    // this.setState( { oldValue: JSON.stringify(res, null, 4)})
    const t = JSON.parse(res).dependencies;
    const mm = JSON.stringify(t, null, 4);

    return mm;
  });
}

export function getPackage(name) {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Basic dmVyZGFjY2lvX2NpOnd1R1hnYXFXMnJuYjZMM3NmVUJKcDh6aUFvWnRoZQ=="
  );

  const requestOptions = {
    headers: myHeaders
  };
  return request(`https://repo.ztools.app/verdaccio/${name}`, requestOptions);
}

function getTag(branch) {
  switch (branch) {
    case "develop":
      return "alpha";
    case "staging":
      return "beta";
    case "master":
      return "";
  }
}

function getVersion(pkg, branch) {
  const { versions } = pkg;
  const { latest } = pkg["dist-tags"];
  const list = Object.keys(versions).reverse();

  const tag = getTag(branch);

  const ver = list.find(version => {
    const sem = semver.parse(version);
    const { prerelease } = sem;

    if (tag) {
      // branch develop, staging
      const [tagV] = prerelease;
      if (tagV === tag) return true;
    } else if (!prerelease.length) {
      return true;
    }

    return false;
  });

  return ver;
}

export async function getVerdaccio(branch) {
  const result = await getAllListPkg();

  const obj = result.reduce((obj, pkg) => {
    const { name } = pkg;

    obj[name] = getVersion(pkg, branch);
    return obj;
  }, {});

  const mm = JSON.stringify(obj, null, 4);
  return mm;
}

export async function getAllListPkg() {
  const list = [
    "@zpi/spa-bank",
    "@zpi/spa-cashier",
    "@zpi/spa-common",
    "@zpi/spa-lixi",
    "@zpi/spa-merchant",
    "@zpi/spa-money-transfer",
    "@zpi/spa-plugins",
    "@zpi/spa-telco",
    "@zpi/spa-ui",
    "@zpi/spa-wallet"
  ];

  const result = await Promise.all(list.map(name => getPackage(name)));

  return result;
}
