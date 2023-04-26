interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  homepage: string | null;
}

async function getRepos(): Promise<Repo[]> {
  console.log('Fetching repos...');
  let page = 1;
  let repos: Repo[] = [];

  do {
    const response = await fetch(`https://api.github.com/users/willuhmjs/repos?page=${page}&per_page=100`);
    const newRepos = await response.json();

    if (newRepos.length === 0) {
      break;
    }

    repos = [...repos, ...newRepos];
    page++;
  } while (true);

  return repos;
}


function processRepos(repos: Repo[]): string {
  console.log(`Processing ${repos.length} repos...`);
  const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

  let markdown = `# willuhmjs.github.io\n\nThis is an auto generated list of my repositories. Check out [https://willuhmjs.com](https://willuhmjs.com). Last updated ${new Date().toISOString()} \n\n## Repositories\n`;
  for (const repo of sorted) {
    const { name, description, html_url, stargazers_count, homepage } = repo;

    markdown += `- [${name} (${stargazers_count})](${html_url}) ${
      homepage ? `([homepage](${homepage}))` : ''
    } - ${description || 'No description provided.'}\n`;
  }

  return markdown;
}

(async () => {
  const repos = await getRepos();
  const markdown = processRepos(repos);

  console.log(`Writing ${repos.length} repos to README.md...`);
  Deno.writeTextFileSync('README.md', markdown);

  console.log('Done!');
})();
