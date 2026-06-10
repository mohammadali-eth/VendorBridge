import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, File, X, AlertTriangle, Loader2 } from 'lucide-react';
import { rfqService } from '../../services/rfq.service';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'image/png',
  'image/jpeg',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.png', '.jpg', '.jpeg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function AttachmentUploader() {
  const { watch, setValue } = useFormContext();
  const attachments = watch('attachments') || [];

  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = async (fileList) => {
    setError(null);
    const filesToUpload = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = '.' + file.name.split('.').pop().toLowerCase();

      if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(extension)) {
        setError(`File type ${file.name} is not allowed. Only PDF, DOCX, XLSX, PNG, JPG allowed.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} exceeds the 10MB limit.`);
        return;
      }

      filesToUpload.push({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    if (filesToUpload.length === 0) return;

    setUploading(true);
    try {
      // API call to mock upload
      const uploaded = await rfqService.uploadAttachments(filesToUpload);
      setValue('attachments', [...attachments, ...uploaded], { shouldValidate: true });
    } catch (err) {
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveFile = (index) => {
    const next = attachments.filter((_, idx) => idx !== index);
    setValue('attachments', next, { shouldValidate: true });
  };

  const getReadableSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <h4 className="text-sm font-bold text-slate-800">RFQ Attachments</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload specifications sheets, designs, or standard terms (Max 10MB per file).
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#714B67] bg-[#F5EEF4]/30'
            : 'border-slate-200 hover:border-[#714B67] hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-[#714B67] animate-spin" />
              <p className="text-xs font-semibold text-[#714B67]">Uploading files...</p>
            </>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-[#F5EEF4] text-[#714B67] mb-1">
                <Upload className="h-6 w-6 stroke-[2]" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Drag & drop files or click to upload
              </p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                PDF, DOCX, XLSX, PNG, JPG (UP TO 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* File List */}
      {attachments.length > 0 && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="p-3 bg-white flex items-center justify-between hover:bg-slate-50/50"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
                  <File className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px] sm:max-w-md">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase mt-0.5">
                    {getReadableSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
