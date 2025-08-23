import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Copy, Sparkles, ArrowRight, RotateCcw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { transformTextWithGroq } from "@/services/groqService";

const ToneTranslator = () => {
  const [angryText, setAngryText] = useState("");
  const [professionalText, setProfessionalText] = useState("");
  const [isTransforming, setIsTransforming] = useState(false);
  const { toast } = useToast();

  const examples = [
    {
      angry: "This meeting is a complete waste of time and I don't need to be here",
      professional: "I'd like to make sure we're aligned on the meeting objectives and my role in achieving them"
    },
    {
      angry: "Who the hell included me in this project? I have no idea what's going on",
      professional: "I'd appreciate some context on my involvement in this project to ensure I can contribute effectively"
    },
    {
      angry: "This deadline is impossible and whoever set it is delusional",
      professional: "I'd like to discuss the timeline and identify any potential challenges to ensure successful delivery"
    }
  ];

  const transformText = async () => {
    if (!angryText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to transform",
        variant: "destructive"
      });
      return;
    }

    setIsTransforming(true);
    
    try {
      const transformed = await transformTextWithGroq(angryText);
      setProfessionalText(transformed);
      toast({
        title: "✨ Transformed!",
        description: "Your message has been professionally polished",
      });
    } catch (error) {
      console.error("Transformation error:", error);
      toast({
        title: "Transformation failed",
        description: "Unable to transform the message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const copyToClipboard = async () => {
    if (!professionalText) return;
    
    await navigator.clipboard.writeText(professionalText);
    toast({
      title: "Copied!",
      description: "Professional text copied to clipboard",
    });
  };

  const useExample = (example: typeof examples[0]) => {
    setAngryText(example.angry);
    setProfessionalText(example.professional);
  };

  const reset = () => {
    setAngryText("");
    setProfessionalText("");
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              Professional Tone Translator
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Transform your frustrated thoughts into polished, professional communication 
            that you can share with confidence.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered by Groq</span>
          </div>
        </div>

        {/* Main Translator */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <Card className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <h2 className="text-xl font-semibold">Raw Thoughts</h2>
            </div>
            <Textarea
              value={angryText}
              onChange={(e) => setAngryText(e.target.value)}
              placeholder="Type your frustrated, angry, or blunt message here... Let it all out!"
              className="min-h-[200px] bg-secondary/50 border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex gap-2">
              <Button
                onClick={transformText}
                disabled={isTransforming || !angryText.trim()}
                className="transform-button flex-1 relative z-10"
              >
                {isTransforming ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Transform
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="border-border hover:border-primary"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <h2 className="text-xl font-semibold">Professional Output</h2>
            </div>
            <Textarea
              value={professionalText}
              readOnly
              placeholder="Your professional message will appear here..."
              className="min-h-[200px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={copyToClipboard}
              disabled={!professionalText}
              variant="outline"
              className="w-full border-border hover:border-primary"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </Card>
        </div>

        {/* Examples */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Try These Examples</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {examples.map((example, index) => (
              <div
                key={index}
                onClick={() => useExample(example)}
                className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary cursor-pointer transition-all duration-300 hover:bg-secondary/50"
              >
                <div className="text-sm text-muted-foreground mb-2">Before:</div>
                <div className="text-sm mb-3 text-destructive">"{example.angry}"</div>
                <div className="text-sm text-muted-foreground mb-2">After:</div>
                <div className="text-sm text-primary">"{example.professional}"</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ToneTranslator;