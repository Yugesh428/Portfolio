
import Link from 'next/link';

export default function SocialLinks() {
  return (
    <div className="flex gap-3">
      <Link className="badge" href="https://github.com/Yugesh428" target="_blank" rel="noreferrer">GitHub</Link>
      <Link className="badge" href="http://www.linkedin.com/in/yugesh-bastola-315638317/" target="_blank" rel="noreferrer">LinkedIn</Link>
      <Link className="badge" href="mailto:bastolayugesh2@gmail.com">Email</Link>
    </div>
  );
}
