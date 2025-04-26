'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PersonaPage() {
  const [persona, setPersona] = useState({
    name: '',
    description: '',
    targetAudience: '',
    expertise: '',
    tone: '',
    topics: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save persona data
    console.log('Saving persona:', persona);
  };

  return (
    <div className="flex-1 p-8">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Persona Settings</h1>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Set Account Persona</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Persona Name</Label>
                  <Input
                    id="name"
                    value={persona.name}
                    onChange={(e) => setPersona({ ...persona, name: e.target.value })}
                    placeholder="e.g., Tech Expert"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={persona.targetAudience}
                    onChange={(e) => setPersona({ ...persona, targetAudience: e.target.value })}
                    placeholder="e.g., Engineers in their 20s-30s"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise</Label>
                  <Input
                    id="expertise"
                    value={persona.expertise}
                    onChange={(e) => setPersona({ ...persona, expertise: e.target.value })}
                    placeholder="e.g., Web Development, AI, Cloud Technology"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input
                    id="tone"
                    value={persona.tone}
                    onChange={(e) => setPersona({ ...persona, tone: e.target.value })}
                    placeholder="e.g., Professional, Friendly"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Persona Description</Label>
                <Textarea
                  id="description"
                  value={persona.description}
                  onChange={(e) => setPersona({ ...persona, description: e.target.value })}
                  placeholder="Enter detailed description of the persona"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics">Post Topics</Label>
                <Textarea
                  id="topics"
                  value={persona.topics}
                  onChange={(e) => setPersona({ ...persona, topics: e.target.value })}
                  placeholder="Enter post topics separated by commas"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Persona
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}