import Image from 'next/image'
import type { TmdbCastMember } from '@/services/tmdb'
import { getPosterUrl } from '@/services/tmdb'

export default function CastSection({ cast }: { cast: TmdbCastMember[] }) {
  if (!cast.length) return null

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
        Reparto principal
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {cast.map((member) => {
          const photo = getPosterUrl(member.profile_path, 'w185')
          return (
            <div key={member.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              width: 72, gap: 6,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                overflow: 'hidden', flexShrink: 0,
                background: 'var(--surface2)',
                border: '2px solid var(--border)',
                position: 'relative',
              }}>
                {photo ? (
                  <Image src={photo} alt={member.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: 'var(--muted)',
                  }}>
                    {member.name[0]}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, wordBreak: 'break-word' }}>
                  {member.name.split(' ')[0]}
                </p>
                {member.character && (
                  <p style={{ fontSize: 9, color: 'var(--muted)', lineHeight: 1.2, marginTop: 1 }}>
                    {member.character.split('/')[0].trim().slice(0, 12)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
