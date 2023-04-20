const branchVersion = process.env.BRANCH_VERSION || '';
const tagVersion = process.env.TAG_VERSION || '';

const getVersion = (branchVersion, tagVersion) => {
  if (!branchVersion) {
    console.error('❌ No branch version');
    process.exit(1);
  }

  const [branchMajor, branchMinor] = branchVersion.replace('v', '').split('.');

  let patchVersion = 0;

  if (!!tagVersion) {
    const [tagMajor, tagMinor, tagPatch] = tagVersion
      .replace('v', '')
      .split('.');
    patchVersion =
      tagMajor === branchMajor && tagMinor === branchMinor
        ? `${parseInt(tagPatch) + 1}`
        : '0';
  }

  return `${branchMajor}.${branchMinor}.${patchVersion}`;
};

const newBranchVersion = getVersion(branchVersion, tagVersion);

console.log(newBranchVersion);
