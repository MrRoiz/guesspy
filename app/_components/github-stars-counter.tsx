import { Github } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';
import { Button } from '@/primitives/components/ui/button';

const REPO = 'MrRoiz/guesspy';

type Props = {
  label: string;
  className?: string;
};

export const GithubStarsCounter: FC<Props> = async ({ className, label }) => {
  const request = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  const repo = await request.json();

  return (
    <Link
      className={className}
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer">
      <Button variant="outline">
        <Github /> {repo.stargazers_count} {label}
      </Button>
    </Link>
  );
};
