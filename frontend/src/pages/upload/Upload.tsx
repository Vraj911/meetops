import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, Music, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeetingStore } from "@/stores/meeting.store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export default function Upload() {
  const navigate = useNavigate();
  const { setMeeting, setUploadedFile, uploadMethod, setUploadMethod, uploadedFile } = useMeetingStore();
  const [title, setTitle] = useState("Q4 Planning - Engineering");
  const [date, setDate] = useState("2024-03-15");
  const [time, setTime] = useState("14:30");
  const [duration, setDuration] = useState("45m");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  }, [setUploadedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleSubmit = () => {
    setMeeting({ title, date, time, duration });
    navigate(ROUTES.PROCESSING);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold">Upload Meeting</h1>
        <p className="text-muted-foreground mt-1">Add your meeting transcript or audio for AI processing</p>
      </div>

      {/* Meeting Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Meeting Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Upload Method Toggle */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Upload Method</h2>
        <div className="flex gap-2">
          <Button variant={uploadMethod === 'transcript' ? 'default' : 'outline'} onClick={() => setUploadMethod('transcript')} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />Transcript
          </Button>
          <Button variant={uploadMethod === 'audio' ? 'default' : 'outline'} onClick={() => setUploadMethod('audio')} className="flex-1">
            <Music className="h-4 w-4 mr-2" />Audio
          </Button>
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          uploadedFile && "border-success bg-success/5"
        )}
      >
        {uploadedFile ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-success" />
            <div className="text-left">
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => setUploadedFile(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <UploadIcon className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <p className="text-foreground">Drag & drop {uploadMethod} file here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input type="file" className="hidden" id="file-upload" onChange={handleFileSelect} accept={uploadMethod === 'transcript' ? '.txt,.docx,.md' : '.mp3,.m4a,.wav'} />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild><span>Browse Files</span></Button>
            </label>
            <p className="text-xs text-muted-foreground">
              Supports: {uploadMethod === 'transcript' ? '.txt, .docx, .md (Max 50MB)' : '.mp3, .m4a, .wav (Max 100MB)'}
            </p>
          </div>
        )}
      </div>

      {/* Destination */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Destination</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">JIRA Project</label>
            <Button variant="outline" className="w-full justify-between">ENG - Engineering <ChevronDown className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Calendar</label>
            <Button variant="outline" className="w-full justify-between">Team Calendar <ChevronDown className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <Button size="xl" className="w-full" onClick={handleSubmit}>
        Start Processing
      </Button>
    </div>
  );
}
