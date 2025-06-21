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

type IdentificationResult = IdentifyFruitVegetableOutput['identification'];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setError('Please select an image file.');
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
        const aiResult = await identifyFruitVegetable({ photoDataUri });
        if (aiResult && aiResult.identification) {
          setResult(aiResult.identification);
        } else {
            setError('Could not identify the item in the image. Please try a different one.');
        }
      } catch (e) {
        console.error(e);
        setError('An error occurred during identification. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setError('Failed to read the image file.');
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="p-4 border-b bg-card">
        <div className="container mx-auto flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Bot className="text-primary-foreground h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">AgriInfoAI</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid gap-12">
          <section className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">Identify and Grow with AI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload a picture of a fruit or vegetable, and our AI will tell you what it is and how to grow it.
            </p>
          </section>

          <Card className="max-w-2xl mx-auto w-full shadow-lg">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image of a fruit or vegetable to identify.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="sr-only">Upload Image</Label>
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
                        <span className="font-semibold">Click to upload or drag and drop</span>
                        <span className="text-sm">PNG, JPG, or WEBP</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground" disabled={loading || !previewUrl}>
                  {loading ? 'Identifying...' : 'Identify Produce'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {error && (
            <Alert variant="destructive" className="max-w-4xl mx-auto w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && <ResultsSkeleton />}
          
          {result && <ResultsDisplay result={result} previewUrl={previewUrl} />}

        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>Powered by AI. Grow smarter with AgriInfoAI.</p>
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

const ResultsDisplay = ({ result, previewUrl }: { result: IdentificationResult; previewUrl: string | null }) => (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
        <div className="md:col-span-1">
            <Card className="shadow-lg sticky top-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{result.commonName}</CardTitle>
                    <CardDescription>Identified Produce</CardDescription>
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
                            <span>How to Get Seeds</span>
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
                            <span>Best Growing Conditions</span>
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
                            <span>How to Grow: Step-by-Step</span>
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
                         <CardTitle className="text-lg font-headline">Additional Resources</CardTitle>
                       </div>
                        <Button asChild variant="ghost" size="sm">
                            <a href={`https://www.google.com/search?q=buy+${result.commonName}+seeds+or+plants`} target="_blank" rel="noopener noreferrer">
                                Buy Seeds or Plants
                            </a>
                        </Button>
                    </CardHeader>
                </Card>
            </Accordion>
        </div>
    </div>
);
