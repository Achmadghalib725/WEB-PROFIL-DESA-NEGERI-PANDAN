'use client';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import './org.css';

export default function ProfilPage() {
  useScrollReveal();
  const supabase = createClient();
  const [orgData, setOrgData] = useState({});

  useEffect(() => {
    async function fetchOrgData() {
      const { data } = await supabase.from('pengaturan_halaman').select('value').eq('id', 'struktur_organisasi').single();
      if (data && data.value) {
        setOrgData(typeof data.value === 'string' ? JSON.parse(data.value) : data.value);
      }
    }
    fetchOrgData();
  }, [supabase]);

  const defaultDusuns = [
    { id: 'kadus_1', jabatan: 'KADUS I<br/>WAY TEMAGA', name: 'NURDIN USMAN', rts: ['1. MIN HUSNI', '2. M. RIZA'] },
    { id: 'kadus_2', jabatan: 'KADUS II<br/>WAY SALAK', name: 'SAIPUL', rts: ['3. -', '4. ANSORI'] },
    { id: 'kadus_3', jabatan: 'KADUS III<br/>WAY HANAU', name: 'ASHAR', rts: ['5. ZAINL RJ', '6. TOPAN BASIRUN'] },
    { id: 'kadus_4', jabatan: 'KADUS IV<br/>WAY PANDAN', name: 'JONI SAHRIZAL', rts: ['7. -'] },
    { id: 'kadus_5', jabatan: 'KADUS V<br/>KUMBANG TANJUNG', name: 'SAHIDAN', rts: ['8. SARIFUDDIN', '9. WARSITO'] },
    { id: 'kadus_6', jabatan: 'KADUS VI<br/>LUBUK JUKUNG', name: 'KHOLIJAN MAULANA', rts: ['11. YUSMUNAZI', '12. ROJANI'] }
  ];
  const dusuns = (orgData && orgData.dusuns && orgData.dusuns.length > 0) ? orgData.dusuns : defaultDusuns;

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="separator">/</span>
            <span>Profil Desa</span>
          </div>
          <div className="section-label">Tentang Kami</div>
          <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
            Profil <span className="accent">Desa</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '18px', marginTop: '10px' }}>
            Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan
            Desa Negeri Pandan.
          </p>
        </div>
      </header>

      {/* Sejarah */}
      <section className="section">
        <div className="container">
          <div className="section-label">Sejarah Desa</div>
          <h2 className="section-title">
            Kepala Desa <span className="accent">Negeri Pandan</span>
          </h2>
          <p style={{ marginTop: '1rem', color: 'var(--clr-text-secondary)', maxWidth: '800px', lineHeight: '1.6' }}>
            Desa Negeri Pandan adalah merupakan Desa Negeri Pandan yang menjadi Kepala Desa Definitif dari masa ke masa yaitu sebagai berikut:
          </p>

          <div className="timeline" style={{ marginTop: '3rem' }}>
            <div className="timeline-item reveal">
              <div className="timeline-year">1957</div>
              <h3>KHADIN SINGA LANA</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">1957 s/d 1976</div>
              <h3>RAJA MANGUNANG / RUSLI</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">Pjs</div>
              <h3>A. RAHMAN / JURAGAN</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">1977 s/d 1987</div>
              <h3>M. YUNUS KR</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">1987 s/d 1997</div>
              <h3>M. UBAT</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">1997 s/d 2007</div>
              <h3>SUPLIMANSYAH</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">2007 s/d 2013</div>
              <h3>SUHAR PUJIANTO</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">2013 s/d 2019</div>
              <h3>RIDWAN</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">Pjs</div>
              <h3>KR. RAHMAN SANGUN DIRATU</h3>
            </div>
            <div className="timeline-item reveal">
              <div className="timeline-year">2019 s/d Sekarang</div>
              <h3>SUPLIMANSYAH</h3>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Demografi */}
      <section className="section">
        <div className="container">
          <div className="section-label">Demografi</div>
          <h2 className="section-title">
            Wilayah & <span className="accent">Orbitasi</span>
          </h2>
          
          <div className="demografi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {/* Batas Wilayah */}
            <div className="glass-card reveal">
               <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--clr-text-primary)' }}>Batas Wilayah Desa</h3>
               <p style={{ color: 'var(--clr-text-secondary)', marginBottom: '1.5rem' }}>Letak geografi Desa Negeri Pandan, terletak diantara:</p>
               <ul style={{ listStyleType: 'none', padding: 0 }}>
                 <li style={{ marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: 'var(--clr-primary-light)', display: 'block', fontSize: '0.9rem' }}>Sebelah Utara</span>
                    <strong>Berbatasan dg Desa Tanjung Sari-Palas</strong>
                 </li>
                 <li style={{ marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: 'var(--clr-primary-light)', display: 'block', fontSize: '0.9rem' }}>Sebelah Selatan</span>
                    <strong>Berbatasan dg Desa Sukaratu dan Palembapang</strong>
                 </li>
                 <li style={{ marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: 'var(--clr-primary-light)', display: 'block', fontSize: '0.9rem' }}>Sebelah Barat</span>
                    <strong>Berbatasan dg Desa Sukaratu dan Tajimalela</strong>
                 </li>
                 <li style={{ marginBottom: '0.8rem' }}>
                    <span style={{ color: 'var(--clr-primary-light)', display: 'block', fontSize: '0.9rem' }}>Sebelah Timur</span>
                    <strong>Berbatasan dg Desa Palembapang</strong>
                 </li>
               </ul>
            </div>
            
            {/* Orbitasi */}
            <div className="glass-card reveal reveal-delay-1">
               <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--clr-text-primary)' }}>Orbitasi</h3>
               <ul style={{ listStyleType: 'none', padding: 0 }}>
                 <li style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: 'var(--clr-text-secondary)' }}>Jarak ke ibu kota kecamatan</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--clr-primary-light)' }}>6 Km</strong>
                 </li>
                 <li style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: 'var(--clr-text-secondary)' }}>Lama tempuh ke kecamatan</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--clr-primary-light)' }}>10 Menit</strong>
                 </li>
                 <li style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ color: 'var(--clr-text-secondary)' }}>Jarak ke ibu kota kabupaten</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--clr-primary-light)' }}>8 Km</strong>
                 </li>
                 <li style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--clr-text-secondary)' }}>Lama tempuh ke kabupaten</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--clr-primary-light)' }}>15 Menit</strong>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Struktur Organisasi */}
      <section className="section">
        <div className="container">
          <div className="section-label">Pemerintahan Desa</div>
          <h2 className="section-title">
            Struktur <span className="accent">Organisasi</span>
          </h2>
          <p style={{ marginTop: '1rem', color: 'var(--clr-text-secondary)', textAlign: 'center', marginBottom: '3rem' }}>
            {orgData.periode || 'Periode 2019 - 2025'}
          </p>
          
          <div className="org-tree-container reveal">
            <div className="org-tree">
              <ul>
                <li>
                  <div className="side-wrapper">
                    <div className="side-node-left">
                      <div className="org-node">
                        {orgData['bpd']?.image_url && <img src={orgData['bpd'].image_url} alt="BPD" className="org-photo" />}
                        <h4>{orgData['bpd']?.name || 'BPD'}</h4>
                      </div>
                    </div>
                    <div className="org-node org-node-kades">
                      {orgData['kepala_desa']?.image_url && <img src={orgData['kepala_desa'].image_url} alt="Kepala Desa" className="org-photo" />}
                      <h4>KEPALA DESA</h4>
                      <strong>{orgData['kepala_desa']?.name || 'SUPLIMANSYAH'}</strong>
                    </div>
                    <div className="side-node-right">
                      <div className="org-node">
                        {orgData['lpm']?.image_url && <img src={orgData['lpm'].image_url} alt="LPM" className="org-photo" />}
                        <h4>{orgData['lpm']?.name || 'LPM'}</h4>
                      </div>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', padding: '10px' }}>
                         <div className="org-node">
                           {orgData['kasi_pemerintahan']?.image_url && <img src={orgData['kasi_pemerintahan'].image_url} alt="Kasi Pemerintahan" className="org-photo" />}
                           <h4>KASI PEMERINTAHAN</h4>
                           <strong>{orgData['kasi_pemerintahan']?.name || 'IRHAM FEROZIE'}</strong>
                         </div>
                         <div className="org-node">
                           {orgData['kasi_kesejahteraan']?.image_url && <img src={orgData['kasi_kesejahteraan'].image_url} alt="Kasi Kesejahteraan" className="org-photo" />}
                           <h4>KASI KESEJAHTERAAN</h4>
                           <strong>{orgData['kasi_kesejahteraan']?.name || 'TIO ALIM FATWA, S.IP'}</strong>
                         </div>
                         <div className="org-node">
                           {orgData['kasi_pelayanan']?.image_url && <img src={orgData['kasi_pelayanan'].image_url} alt="Kasi Pelayanan" className="org-photo" />}
                           <h4>KASI PELAYANAN</h4>
                           <strong>{orgData['kasi_pelayanan']?.name || 'SAHRULLOH'}</strong>
                         </div>
                      </div>
                    </li>
                    <li>
                      <div style={{ padding: '0', border: 'none', background: 'transparent', height: '20px' }}></div>
                      <ul>
                        {dusuns.map((dusun, idx) => (
                          <li key={dusun.id || idx}>
                            <div className="org-node">
                              <h4 style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: (dusun.jabatan || '').replace(/\n/g, '<br/>') }} />
                            </div>
                            <ul>
                              <li>
                                <div className="org-node">
                                  {dusun.image_url && <img src={dusun.image_url} alt="Profil Kadus" className="org-photo" />}
                                  <strong>{dusun.name || '-'}</strong>
                                </div>
                                {dusun.rts && dusun.rts.length > 0 && (
                                  <ul>
                                    <li>
                                      <div className="org-node">
                                        <ul className="org-rt-list">
                                          {dusun.rts.map((rt, rIdx) => (
                                            <li key={rIdx}>{rt}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </li>
                                  </ul>
                                )}
                              </li>
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="side-wrapper">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                           <div className="org-node" style={{ position: 'relative' }}>
                             {orgData['pengurus_barang']?.image_url && <img src={orgData['pengurus_barang'].image_url} alt="Pengurus Barang" className="org-photo" />}
                             <h4 style={{ margin: 0 }}>PENGURUS<br/>INVENTARISIR BARANG</h4>
                             <strong style={{ display: 'block', marginTop: '5px' }}>{orgData['pengurus_barang']?.name || 'HENDRI SURAHMAN'}</strong>
                             <div style={{ position: 'absolute', right: '-20px', top: '50%', width: '20px', borderBottom: '2px dashed var(--clr-primary-light)' }}></div>
                           </div>
                           <div className="org-node" style={{ position: 'relative' }}>
                             {orgData['operator_desa']?.image_url && <img src={orgData['operator_desa'].image_url} alt="Operator Desa" className="org-photo" />}
                             <h4 style={{ margin: 0 }}>STAP/OPERATOR DESA</h4>
                             <strong style={{ display: 'block', marginTop: '5px' }}>{orgData['operator_desa']?.name || 'AYU HANNA, S.IP'}</strong>
                             <div style={{ position: 'absolute', right: '-20px', top: '50%', width: '20px', borderBottom: '2px dashed var(--clr-primary-light)' }}></div>
                           </div>
                           {/* Vertical dashed line connecting them */}
                           <div style={{ position: 'absolute', right: '-20px', top: '25%', bottom: '25%', borderRight: '2px dashed var(--clr-primary-light)' }}></div>
                           {/* Horizontal line going to Sekdes */}
                           <div style={{ position: 'absolute', right: '-40px', top: '50%', width: '20px', borderBottom: '2px dashed var(--clr-primary-light)' }}></div>
                        </div>
                        <div className="org-node" style={{ marginLeft: '20px' }}>
                          {orgData['sekdes']?.image_url && <img src={orgData['sekdes'].image_url} alt="Sekretaris Desa" className="org-photo" />}
                          <h4>SEKRETARIS DESA</h4>
                          <strong>{orgData['sekdes']?.name || 'TRI AGUNG ALMANDA, S.H'}</strong>
                        </div>
                      </div>
                      <ul>
                        <li>
                          <div className="org-node">
                            {orgData['kaur_tu']?.image_url && <img src={orgData['kaur_tu'].image_url} alt="Kaur TU" className="org-photo" />}
                            <h4>KAUR TATA USAHA<br/>DAN UMUM</h4>
                            <strong>{orgData['kaur_tu']?.name || 'M. SAID'}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="org-node">
                            {orgData['kaur_keuangan']?.image_url && <img src={orgData['kaur_keuangan'].image_url} alt="Kaur Keuangan" className="org-photo" />}
                            <h4>KAUR KEUANGAN</h4>
                            <strong>{orgData['kaur_keuangan']?.name || 'ROFI RIAN SAPUTRA, S.Pd'}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="org-node">
                            {orgData['kaur_perencanaan']?.image_url && <img src={orgData['kaur_perencanaan'].image_url} alt="Kaur Perencanaan" className="org-photo" />}
                            <h4>KAUR PERENCANAAN</h4>
                            <strong>{orgData['kaur_perencanaan']?.name || 'SOPENDI'}</strong>
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
