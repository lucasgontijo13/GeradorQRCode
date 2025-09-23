// src/QRCodeGenerator.jsx

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
// Removemos o ícone FiFileText que não será mais usado
import { FiDownload, FiLoader, FiLink, FiList } from 'react-icons/fi';
import './QRCodeGenerator.css';

function QRCodeGenerator() {
  const [mode, setMode] = useState('single');
  const [singleLink, setSingleLink] = useState('');
  const [batchLinks, setBatchLinks] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validLinkCount, setValidLinkCount] = useState(0);

  // Estado para controlar se o input é um link válido
  const [isUrl, setIsUrl] = useState(false);

  // Função para validar se uma string parece ser uma URL (permanece a mesma)
  const isValidUrl = (string) => {
    if (!string) return false;
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' + 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(string);
  };

  // useEffect para fazer a detecção em tempo real (permanece o mesmo)
  useEffect(() => {
    if (mode === 'single') {
      setIsUrl(isValidUrl(singleLink));
    }
  }, [singleLink, mode]);

  const parseLinksFromText = (text) => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s,;]+)/g;
    const matches = text.match(urlRegex) || [];
    return [...new Set(matches)];
  };

  useEffect(() => {
    if (mode === 'batch') {
      const links = parseLinksFromText(batchLinks);
      setValidLinkCount(links.length);
    }
  }, [batchLinks, mode]);

  const generateFileName = (url, index) => {
    try {
      const parsedUrl = new URL(url);
      let hostname = parsedUrl.hostname;
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      const keyword = hostname.split('.')[0];
      const cleanKeyword = keyword.slice(0, 20);
      return `${index + 1}_${cleanKeyword}.png`;
    } catch (e) {
      console.warn(`Não foi possível analisar a URL "${url}" para gerar um nome. Usando fallback. Erro:`, e);
      return `qrcode_${index + 1}_${Date.now()}.png`;
    }
  };

  const qrOptions = {
    errorCorrectionLevel: 'H', type: 'image/png', quality: 0.95, margin: 1, scale: 12,
  };

  const handleGenerateSingle = async () => {
    // Adicionamos uma verificação extra para segurança
    if (!singleLink || !isValidUrl(singleLink)) return; 
    try {
      const url = await QRCode.toDataURL(singleLink, qrOptions);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao gerar o QR Code.');
    }
  };
  
  const handleGenerateBatch = async () => {
    const links = parseLinksFromText(batchLinks);
    if (links.length === 0) {
      alert('Nenhum link válido foi encontrado.'); return;
    }
    setIsLoading(true);
    setQrCodeUrl('');
    const zip = new JSZip();
    try {
      for (const [index, link] of links.entries()) {
        const fileName = generateFileName(link, index);
        const dataUrl = await QRCode.toDataURL(link, qrOptions);
        const base64Data = dataUrl.split(',')[1];
        zip.file(fileName, base64Data, { base64: true });
      }
      const content = await zip.generateAsync({ type: 'blob' });
      const linkEl = document.createElement('a');
      linkEl.href = URL.createObjectURL(content);
      linkEl.download = 'qrcodes.zip';
      document.body.appendChild(linkEl);
      linkEl.click();
      document.body.removeChild(linkEl);
    } catch (err) {
      console.error("Erro detalhado:", err);
      alert('Ocorreu um erro ao gerar o pacote.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="qr-generator-wrapper">
      <div className="qr-generator-card">
        <div className="card-header">
          <h1>Gerador de QR Code</h1>
          <p>Crie QR Codes de forma rápida e moderna.</p>
        </div>

        <div className="mode-switcher">
          <input type="radio" id="single" value="single" checked={mode === 'single'} onChange={() => setMode('single')} />
          <label htmlFor="single">Link Único</label>
          <input type="radio" id="batch" value="batch" checked={mode === 'batch'} onChange={() => setMode('batch')} />
          <label htmlFor="batch">Vários Links</label>
        </div>

        {mode === 'single' ? (
          <div className="form-group">
            <input 
              type="text" 
              className="form-input"
              value={singleLink}
              onChange={(e) => setSingleLink(e.target.value)}
              // Placeholder volta a ser específico para links
              placeholder="https://seusite.com"
            />
            {/* *** LÓGICA DO HELPER TEXT ATUALIZADA *** */}
            <div className={`input-helper ${singleLink && !isUrl ? 'error' : (isUrl ? 'success' : '')}`}>
              {!singleLink && 'Insira um link válido para gerar o QR Code.'}
              {singleLink && !isUrl && 'O texto inserido não parece ser um link válido.'}
              {singleLink && isUrl && '✅ Link válido detectado.'}
            </div>
            {/* *** LÓGICA DO BOTÃO ATUALIZADA *** */}
            <button className="btn-primary" onClick={handleGenerateSingle} disabled={!singleLink || !isUrl}>
              <FiLink />
              Gerar QR Code
            </button>
          </div>
        ) : (
          <div className="form-group">
            <textarea 
              className="form-textarea"
              value={batchLinks}
              onChange={(e) => setBatchLinks(e.target.value)}
              placeholder="Cole seus links aqui..."
            />
            <div className={`input-helper ${validLinkCount > 0 ? 'success' : ''}`}>
              {validLinkCount > 0 
                ? `✅ ${validLinkCount} link(s) válido(s) detectado(s).` 
                : "Cole ou digite os links que deseja converter."}
            </div>
            <button className="btn-primary" onClick={handleGenerateBatch} disabled={isLoading || validLinkCount === 0}>
              {isLoading ? (
                <><FiLoader className="loader-icon" /> Gerando...</>
              ) : (
                <><FiList /> Gerar e Baixar .ZIP</>
              )}
            </button>
          </div>
        )}

        {qrCodeUrl && mode === 'single' && (
          <div className="qr-preview">
            <img src={qrCodeUrl} alt="QR Code gerado" style={{maxWidth: '300px', height: 'auto'}} />
            <a 
              className="download-link" 
              href={qrCodeUrl} 
              // Lógica de nome de arquivo simplificada, pois sempre será um link
              download={generateFileName(singleLink, 0)}
            >
              <FiDownload /> Baixar QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRCodeGenerator;