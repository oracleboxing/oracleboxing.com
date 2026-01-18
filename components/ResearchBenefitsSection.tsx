'use client'

import { useState } from 'react'

interface ResearchItem {
  title: string
  highlightWord: string
  finding: string
  source: string
}

interface CategoryData {
  name: string
  items: ResearchItem[]
}

const researchData: CategoryData[] = [
  {
    name: 'Mental Health',
    items: [
      {
        title: 'Less',
        highlightWord: 'depression',
        finding: '54% reduction in depressive symptoms after 10 weeks of boxing-based training',
        source: 'Bozdarov et al. (2025). PLoS ONE, Mindfulness-Based Boxing Therapy study'
      },
      {
        title: 'Less',
        highlightWord: 'anxiety',
        finding: '51% reduction in anxiety symptoms with non-contact boxing training',
        source: 'Bozdarov et al. (2025). PLoS ONE, Mindfulness-Based Boxing Therapy study'
      },
      {
        title: 'Higher',
        highlightWord: 'well-being',
        finding: 'Meta-analysis of 14 studies: martial arts training had significant positive effect on psychological well-being (d=0.35)',
        source: 'Moore et al. (2020). Journal of Bodywork & Movement Therapies'
      },
      {
        title: 'Reduced',
        highlightWord: 'PTSD symptoms',
        finding: 'Structured non-contact boxing programs significantly decrease PTSD symptoms in trauma survivors',
        source: 'Bozdarov et al. (2022). American Journal of Lifestyle Medicine'
      },
      {
        title: 'Better',
        highlightWord: 'mood',
        finding: 'High-intensity boxing led to clinically meaningful improvements in mood and decreased negative emotions',
        source: 'Bozdarov et al. (2022). American Journal of Lifestyle Medicine'
      }
    ]
  },
  {
    name: 'Confidence',
    items: [
      {
        title: 'Higher',
        highlightWord: 'self-efficacy',
        finding: 'Martial arts training significantly improves total self-efficacy compared to controls (F(1, 238) = 28.23, p < 0.001)',
        source: 'MDPI Philosophy (2023). Effect of Martial Arts on Self-Efficacy'
      },
      {
        title: 'More',
        highlightWord: 'assertiveness',
        finding: 'Self-defense training led to significantly higher assertiveness and ability to stand your ground',
        source: 'Weitlauf et al. (2000). Journal of Applied Psychology'
      },
      {
        title: 'Better',
        highlightWord: 'self-concept',
        finding: 'Martial artists scored significantly higher in physical, intellectual, and ethical confidence (t=3.72, p<0.001)',
        source: 'Pouladei Reishehrei et al. (2014). Procedia - Social and Behavioral Sciences'
      },
      {
        title: 'Less',
        highlightWord: 'self-silencing',
        finding: 'Women in self-defense training reported less tendency to suppress their voice and needs at 1-year follow-up',
        source: 'Hollander & Cunningham (2020). Psychology of Women Quarterly'
      },
      {
        title: 'Improved',
        highlightWord: 'body image',
        finding: 'After 6+ months of training, women reported enhanced self-esteem and improved perception of their bodies',
        source: 'Guthrie (1997). Women in Sport and Physical Activity Journal'
      }
    ]
  },
  {
    name: 'Stress',
    items: [
      {
        title: 'Lower',
        highlightWord: 'cortisol',
        finding: 'Karate practitioners maintained lower baseline cortisol levels (14.00 vs 17.55 µg/dl) than controls',
        source: 'PMC (2018). Endocrine Modulation in Long-Term Karate Practitioners'
      },
      {
        title: 'Higher',
        highlightWord: 'stress resilience',
        finding: 'Martial artists exhibit superior autonomic regulation and faster recovery after stressors',
        source: 'PMC (2023). Heart Rate Variability in Karate Practitioners'
      },
      {
        title: 'Better',
        highlightWord: 'HRV',
        finding: 'Higher Heart Rate Variability indicating a more robust "vagal brake" for down-regulating arousal',
        source: 'Digital Commons WKU. HRV in Martial Arts Training'
      },
      {
        title: 'Improved',
        highlightWord: 'coping',
        finding: 'Training conditions the endocrine system to view stress as "challenge" rather than "threat"',
        source: 'PubMed (2020). Testosterone and Cortisol in Combat Athletes'
      }
    ]
  },
  {
    name: 'Leadership',
    items: [
      {
        title: 'Perceived as',
        highlightWord: 'better leaders',
        finding: 'Physically strong individuals consistently rated as more likely to be leaders and accorded higher social status',
        source: 'Anderson et al. (2016). Journal of Personality and Social Psychology'
      },
      {
        title: 'More',
        highlightWord: 'authority',
        finding: 'Strength conferred a distinct leadership aura independent of attractiveness or height',
        source: 'Anderson et al. (2016). Journal of Personality and Social Psychology'
      },
      {
        title: 'Better',
        highlightWord: 'negotiations',
        finding: 'Harvard\'s "Negotiation Jujitsu" technique uses martial arts principles for better negotiation outcomes',
        source: 'Harvard PON. Negotiation Skills Training'
      },
      {
        title: 'Enhanced',
        highlightWord: 'presence',
        finding: 'Somatic training helps executives project presence, remain grounded, and read the room better',
        source: 'Strozzi-Heckler. Embodied Leadership Research'
      },
      {
        title: 'Higher',
        highlightWord: 'social status',
        finding: 'Strength combined with calmness and self-control led to the highest leadership status conferrals',
        source: 'Anderson et al. (2016). Journal of Personality and Social Psychology'
      }
    ]
  },
  {
    name: 'Social',
    items: [
      {
        title: 'Lower',
        highlightWord: 'aggression',
        finding: 'Long-term martial artists score lower on trait aggression and higher on emotional stability',
        source: 'Nosanchuk (1981) & replications. Traditional Martial Arts and Aggression'
      },
      {
        title: 'Better',
        highlightWord: 'self-control',
        finding: 'Significantly reduced hostility and aggression after training - confidence without reactivity',
        source: 'Weitlauf et al. (2000). Journal of Applied Psychology'
      },
      {
        title: 'More',
        highlightWord: 'respectful',
        finding: 'Practitioners become more respectful of others as a result of training protocols',
        source: 'Konzak & Boudreau (1984). Martial Arts Psychology'
      },
      {
        title: 'Less',
        highlightWord: 'victimization',
        finding: 'Women in self-defense training were less likely to experience sexual assault at 1-year follow-up',
        source: 'Hollander & Cunningham (2020). Psychology of Women Quarterly'
      },
      {
        title: 'Better',
        highlightWord: 'body language',
        finding: 'People with confident, fluid movement were less likely to be targeted for hostility',
        source: 'Grayson & Stein (1981). Journal of Communication'
      }
    ]
  },
  {
    name: 'Brain',
    items: [
      {
        title: 'Higher',
        highlightWord: 'BDNF',
        finding: '8 weeks of martial arts training led to increased serum BDNF levels, correlating with improved cognitive function',
        source: 'PMC (2024). Martial Arts and BDNF in Older Adults'
      },
      {
        title: 'Better',
        highlightWord: 'executive function',
        finding: 'Complex motor planning enhances neural connectivity in the prefrontal cortex',
        source: 'Frontiers in Psychology (2025). Neural Mechanisms in Martial Arts'
      },
      {
        title: 'More',
        highlightWord: 'mindfulness',
        finding: '79% increase in mindful attention measures - boxing forces present-moment awareness',
        source: 'Bozdarov et al. (2025). PLoS ONE'
      },
      {
        title: 'Improved',
        highlightWord: 'impulse control',
        finding: 'Training strengthens neural pathways responsible for emotional regulation and executive control',
        source: 'Frontiers in Psychology (2025). Executive Function in Martial Artists'
      }
    ]
  },
  {
    name: 'Discipline',
    items: [
      {
        title: 'Higher',
        highlightWord: 'grit',
        finding: 'Grit and resilience significantly correlated with years of training - experts score higher with less variance',
        source: 'PMC (2024). Grit and Resilience in Combat Sports'
      },
      {
        title: 'Better',
        highlightWord: 'goal-setting',
        finding: 'Structured belt/skill progression systems build self-efficacy in goal attainment',
        source: 'Psychology of Sport and Exercise. Mental Benefits of Martial Arts'
      },
      {
        title: 'Improved',
        highlightWord: 'self-regulation',
        finding: 'Martial arts training improved self-regulation and even better classroom behavior',
        source: 'ScienceDirect. Self-Regulation Through Martial Arts'
      },
      {
        title: 'Higher',
        highlightWord: 'resilience',
        finding: 'Daily exposure to controlled failure (being hit, thrown) develops generalized resilience',
        source: 'Dominican Scholar. Psychological Characteristics in Judo Athletes'
      }
    ]
  },
  {
    name: 'Presence',
    items: [
      {
        title: 'Better',
        highlightWord: 'posture',
        finding: 'Karate practitioners exhibited zero balance loss in challenging one-legged stances vs. 5-6 touches for others',
        source: 'Hadad et al. (2020). Gait & Posture'
      },
      {
        title: 'More',
        highlightWord: 'confident stance',
        finding: 'Expansive, upright posture boosts others\' perceptions of confidence and competence',
        source: 'MDPI (2023). Embodied Effects of Posture'
      },
      {
        title: 'Better',
        highlightWord: 'eye contact',
        finding: 'Steady gaze developed in training carries over as a sign of confidence in everyday interactions',
        source: 'Strozzi-Heckler. Embodied Leadership'
      },
      {
        title: 'Less',
        highlightWord: 'vulnerability signals',
        finding: 'Criminals identified victims by hesitant gaits; confident movement makes you a "hard target"',
        source: 'Grayson & Stein (1981). Journal of Communication'
      }
    ]
  }
]

export default function ResearchBenefitsSection() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#e5e2dc] text-xs font-medium text-[#847971] uppercase tracking-wider mb-6">
            Research
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#37322F] mb-4"
            style={{ fontFamily: 'ClashDisplay, sans-serif' }}
          >
            Learning to Fight Impacts
            <br />
            <span className="text-[#9a928d]">Your Life in Many Ways</span>
          </h2>
          <p className="text-[#605A57] text-base md:text-lg max-w-2xl mx-auto">
            Research consistently demonstrates the diverse, wide-ranging benefits of combat sports training.
            Below is a collection of peer-reviewed studies highlighting these benefits.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {researchData.map((category, index) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === index
                  ? 'bg-[#37322F] text-white'
                  : 'bg-[#f9f8f6] text-[#605A57] hover:bg-[#e5e2dc]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Research Items */}
        <div className="bg-[#f9f8f6] border border-[#e5e2dc] rounded-2xl p-6 md:p-8">
          <div className="space-y-0">
            {researchData[activeCategory].items.map((item, index) => (
              <div
                key={index}
                className={`py-5 ${
                  index !== researchData[activeCategory].items.length - 1
                    ? 'border-b border-[#e5e2dc]'
                    : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Title */}
                  <div className="md:w-1/4 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      {item.title} <span className="text-[#9a928d]">{item.highlightWord}</span>
                    </h3>
                  </div>

                  {/* Finding & Source */}
                  <div className="md:w-3/4">
                    <p className="text-[#37322F] font-medium mb-2">
                      {item.finding}
                    </p>
                    <p className="text-xs text-[#847971] flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item.source}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-sm text-[#847971] mt-6">
          All findings are from peer-reviewed academic journals and systematic reviews.
        </p>
      </div>
    </section>
  )
}
