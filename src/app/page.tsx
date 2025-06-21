'use client';

import { useState, useRef, type FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { identifyFruitVegetable, type IdentifyFruitVegetableOutput } from '@/ai/flows/identify-fruit-vegetable';
import { Circle, Sprout, Leaf, UploadCloud, AlertCircle, ExternalLink, Bot } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type IdentificationResult = IdentifyFruitVegetableOutput['identification'];

const translations = {
  en: {
    appTitle: 'AgriInfoAI',
    pageTitle: 'Identify and Grow with AI',
    pageDescription: 'Upload a picture of a fruit or vegetable, and our AI will tell you what it is and how to grow it.',
    uploadTitle: 'Upload Image',
    uploadDescription: 'Select an image of a fruit or vegetable to identify.',
    uploadPrompt: 'Click to upload or drag and drop',
    uploadHint: 'PNG, JPG, or WEBP',
    identifyButton: 'Identify Produce',
    identifyingButton: 'Identifying...',
    errorTitle: 'Error',
    errorSelectFile: 'Please select an image file.',
    errorIdentify: 'Could not identify the item in the image. Please try a different one.',
    errorGeneric: 'An error occurred during identification. Please try again.',
    errorReadFile: 'Failed to read the image file.',
    resultsIdentified: 'Identified Produce',
    resultsGetSeeds: 'How to Get Seeds',
    resultsConditions: 'Best Growing Conditions',
    resultsProcess: 'How to Grow: Step-by-Step',
    resultsResources: 'Additional Resources',
    resultsBuySeeds: 'Buy Seeds or Plants',
    footerText: 'Powered by AI. Grow smarter with AgriInfoAI.',
    language: 'Language',
  },
  hi: {
    appTitle: 'एग्रीइन्फोएआई',
    pageTitle: 'एआई के साथ पहचानें और उगाएं',
    pageDescription: 'एक फल या सब्जी की तस्वीर अपलोड करें, और हमारा एआई आपको बताएगा कि यह क्या है और इसे कैसे उगाना है।',
    uploadTitle: 'छवि अपलोड करें',
    uploadDescription: 'पहचानने के लिए किसी फल या सब्जी की छवि चुनें।',
    uploadPrompt: 'अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें',
    uploadHint: 'पीएनजी, जेपीजी, या वेबपी',
    identifyButton: 'उत्पाद की पहचान करें',
    identifyingButton: 'पहचान हो रही है...',
    errorTitle: 'त्रुटि',
    errorSelectFile: 'कृपया एक छवि फ़ाइल चुनें।',
    errorIdentify: 'छवि में आइटम की पहचान नहीं हो सकी। कृपया कोई दूसरा प्रयास करें।',
    errorGeneric: 'पहचान के दौरान एक त्रुटि हुई। कृपया पुन: प्रयास करें।',
    errorReadFile: 'छवि फ़ाइल को पढ़ने में विफल।',
    resultsIdentified: 'पहचाना गया उत्पाद',
    resultsGetSeeds: 'बीज कैसे प्राप्त करें',
    resultsConditions: 'सर्वश्रेष्ठ बढ़ती स्थितियाँ',
    resultsProcess: 'कैसे उगाएं: चरण-दर-चरण',
    resultsResources: 'अतिरिक्त संसाधन',
    resultsBuySeeds: 'बीज या पौधे खरीदें',
    footerText: 'एआई द्वारा संचालित। एग्रीइन्फोएआई के साथ होशियारी से बढ़ें।',
    language: 'भाषा',
  },
};


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const t = translations[language];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setError(null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError(t.errorSelectFile);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const photoDataUri = reader.result as string;
        const aiResult = await identifyFruitVegetable({ photoDataUri, language });
        if (aiResult && aiResult.identification) {
          setResult(aiResult.identification);
        } else {
            setError(t.errorIdentify);
        }
      } catch (e) {
        console.error(e);
        setError(t.errorGeneric);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setError(t.errorReadFile);
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="p-4 border-b bg-card">
        <div className="container mx-auto flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Bot className="text-primary-foreground h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">{t.appTitle}</h1>
          <div className="ml-auto">
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t.language} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid gap-12">
          <section className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">{t.pageTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.pageDescription}
            </p>
          </section>

          <Card className="max-w-2xl mx-auto w-full shadow-lg">
            <CardHeader>
              <CardTitle>{t.uploadTitle}</CardTitle>
              <CardDescription>{t.uploadDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="sr-only">{t.uploadTitle}</Label>
                  <div 
                    className="border-2 border-dashed border-muted/50 rounded-lg p-8 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) { fileInputRef.current!.files = e.dataTransfer.files; handleImageChange({ target: fileInputRef.current } as any); } }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input 
                      type="file" 
                      id="image-upload" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    {previewUrl ? (
                      <div className="relative w-full h-48">
                        <Image src={previewUrl} alt="Image preview" fill className="object-contain rounded-md" data-ai-hint="fruit vegetable" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UploadCloud className="w-12 h-12 text-accent" />
                        <span className="font-semibold">{t.uploadPrompt}</span>
                        <span className="text-sm">{t.uploadHint}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground" disabled={loading || !previewUrl}>
                  {loading ? t.identifyingButton : t.identifyButton}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {error && (
            <Alert variant="destructive" className="max-w-4xl mx-auto w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t.errorTitle}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && <ResultsSkeleton />}
          
          {result && <ResultsDisplay result={result} previewUrl={previewUrl} t={t} />}

        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}

const ResultsSkeleton = () => (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full animate-pulse">
        <div className="md:col-span-1">
            <Card className="shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full h-48 rounded-md" />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
        </div>
    </div>
);

const ResultsDisplay = ({ result, previewUrl, t }: { result: IdentificationResult; previewUrl: string | null; t: typeof translations['en'] }) => (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
        <div className="md:col-span-1">
            <Card className="shadow-lg sticky top-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{result.commonName}</CardTitle>
                    <CardDescription>{t.resultsIdentified}</CardDescription>
                </CardHeader>
                <CardContent>
                    {previewUrl && (
                        <div className="relative w-full h-48 rounded-md overflow-hidden">
                             <Image src={previewUrl} alt={result.commonName} fill className="object-cover" data-ai-hint="fruit vegetable" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
                <AccordionItem value="item-1" className="border rounded-lg bg-card shadow-sm">
                    <AccordionTrigger className="px-6 text-lg hover:no-underline font-headline">
                        <div className="flex items-center gap-3">
                            <Circle className="w-6 h-6 text-accent" />
                            <span>{t.resultsGetSeeds}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base text-muted-foreground">
                        <div className="whitespace-pre-wrap">{result.seedAcquisition}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border rounded-lg bg-card shadow-sm">
                    <AccordionTrigger className="px-6 text-lg hover:no-underline font-headline">
                        <div className="flex items-center gap-3">
                            <Sprout className="w-6 h-6 text-accent" />
                            <span>{t.resultsConditions}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base text-muted-foreground">
                        <div className="whitespace-pre-wrap">{result.growthConditions}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border rounded-lg bg-card shadow-sm">
                    <AccordionTrigger className="px-6 text-lg hover:no-underline font-headline">
                        <div className="flex items-center gap-3">
                            <Leaf className="w-6 h-6 text-accent" />
                            <span>{t.resultsProcess}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base text-muted-foreground">
                        <div className="whitespace-pre-wrap">{result.growthProcess}</div>
                    </AccordionContent>
                </AccordionItem>
                 <Card className="border rounded-lg bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                       <div className="flex items-center gap-3">
                         <ExternalLink className="w-6 h-6 text-accent" />
                         <CardTitle className="text-lg font-headline">{t.resultsResources}</CardTitle>
                       </div>
                        <Button asChild variant="ghost" size="sm">
                            <a href={`https://www.google.com/search?q=buy+${result.commonName}+seeds+or+plants`} target="_blank" rel="noopener noreferrer">
                                {t.resultsBuySeeds}
                            </a>
                        </Button>
                    </CardHeader>
                </Card>
            </Accordion>
        </div>
    </div>
);
