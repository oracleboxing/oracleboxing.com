# Stripe Live Product & Price IDs

> Last refreshed: 2026-02-13 (via Stripe API)
>
> Source of truth for product definitions: `lib/products.ts`
> Source of truth for multi-currency pricing: `lib/currency.ts`

---

## Active Stripe Products (8)

These are the only products with `active: true` in Stripe.

| Product | Stripe Product ID | Metadata | Notes |
|---------|-------------------|----------|-------|
| Boxing from First Principles | `prod_TjkPgCnF8lLzKq` | `bffp` | Multi-currency |
| 21-Day Challenge | `prod_TjkI7d7aeLDQZA` | `21dc_entry` | Multi-currency |
| 2025 Call Recording Vault | `prod_Tjz3jZ2Omr013y` | `vault2025` | Multi-currency |
| Oracle Boxing Tracksuit | `prod_TjkOwVVaNmP3xu` | `tracksuit` | Multi-currency |
| Full Access Membership | `prod_TKqg25PDS8om6s` | `memm` | Monthly + Annual prices |
| 1-on-1 Coaching Tier 1 | `prod_TmMdSWue5DSIMP` | type=coaching | Monthly recurring |
| 1-on-1 Coaching Tier 2 | `prod_TmMdpVbncoqN1F` | type=coaching | Monthly recurring |
| 1-1 Coaching Upgrade | `prod_TrqnTzyKEN079o` | — | One-time $450 |

---

## Active Prices by Product

### Boxing from First Principles (`bffp`)
| Currency | Price ID | Amount |
|----------|----------|--------|
| USD | `price_1SqsfQKPvH4Ddlg1mF9VWoYx` | $147 |
| GBP | `price_1SqsfQKPvH4Ddlg1JhTzOwCi` | £118 |
| EUR | `price_1SqsfRKPvH4Ddlg14ij3TBDO` | €137 |
| AUD | `price_1SqsfRKPvH4Ddlg1b3BuyAds` | A$225 |
| CAD | `price_1SqsfRKPvH4Ddlg1NbJQcY4g` | C$200 |
| AED | `price_1SqsfSKPvH4Ddlg1MFNm72Sh` | AED 541 |

### 21-Day Challenge (`21dc_entry`)
| Currency | Price ID | Amount |
|----------|----------|--------|
| USD | `price_1SmGrnKPvH4Ddlg1PU9ADMJg` | $147 |
| GBP | `price_1SmGtDKPvH4Ddlg1vfcmt0Ct` | £119 |
| EUR | `price_1SmGtIKPvH4Ddlg1CzC05OGL` | €139 |
| AUD | `price_1SmGtLKPvH4Ddlg14OIm6Q67` | A$229 |
| CAD | `price_1SmGtPKPvH4Ddlg12vlBjV45` | C$199 |
| AED | `price_1SmGtSKPvH4Ddlg1Oqmbkyo3` | AED 539 |

### 2025 Call Recording Vault (`vault2025`)
| Currency | Price ID | Amount |
|----------|----------|--------|
| USD | `price_1SqsfSKPvH4Ddlg10SzRFcNc` | $97 |
| GBP | `price_1SqsfTKPvH4Ddlg1p3VZj2kt` | £78 |
| EUR | `price_1SqsfTKPvH4Ddlg1vEnBgJpe` | €90 |
| AUD | `price_1SqsfUKPvH4Ddlg1VzWxecN3` | A$149 |
| CAD | `price_1SqsfUKPvH4Ddlg1imuzEeHA` | C$132 |
| AED | `price_1SqsfUKPvH4Ddlg1qqd0pC23` | AED 357 |

### Oracle Boxing Tracksuit (`tracksuit`)
| Currency | Price ID | Amount |
|----------|----------|--------|
| USD | `price_1SmGu8KPvH4Ddlg1DFeeP234` | $187 |
| GBP | `price_1SmGuHKPvH4Ddlg1hstrUKOK` | £149 |
| EUR | `price_1SmGufKPvH4Ddlg1zbn0I0Xb` | €174 |
| AUD | `price_1SmGunKPvH4Ddlg1tSt6Zsz1` | A$280 |
| CAD | `price_1SmGutKPvH4Ddlg1JJSLG90g` | C$254 |
| AED | `price_1SmGuvKPvH4Ddlg1sOfG7Fip` | AED 687 |

### Full Access Membership
| Interval | Price ID | Amount |
|----------|----------|--------|
| Monthly | `price_1Sog67KPvH4Ddlg1QcPb81XL` | $97/mo |
| Annual | `price_1Sog6MKPvH4Ddlg1Cc9KzKT6` | $897/yr |

### 1-on-1 Coaching Tier 1 (`prod_TmMdSWue5DSIMP`)
| Variant | Price ID | Amount |
|---------|----------|--------|
| Charlie Tier 1 | `price_1SwLraKPvH4Ddlg1OnBMVSAC` | $333/mo |
| Tier 1 | `price_1SonyzKPvH4Ddlg1BN0tsim4` | $400/mo |

### 1-on-1 Coaching Tier 2 (`prod_TmMdpVbncoqN1F`)
| Variant | Price ID | Amount |
|---------|----------|--------|
| Charlie Tier 2 | `price_1SwLraKPvH4Ddlg1r5SzuFPi` | $500/mo |
| Tier 2 | `price_1Sonz0KPvH4Ddlg1bNZJbS3l` | $600/mo |

### 1-1 Coaching Upgrade (`prod_TrqnTzyKEN079o`)
| Price ID | Amount |
|----------|--------|
| `price_1Su75gKPvH4Ddlg1AG90H5HN` | $450 (one-time) |

---

## Archived Products Still Used in Codebase

These Stripe products are **archived** but their price IDs are still active and referenced in `lib/products.ts`.

| Product | Stripe Product ID | Metadata | Price (USD) |
|---------|-------------------|----------|-------------|
| Oracle Boxing Bundle | `prod_TKqgHrxaUX30MC` | `obm` | $397 |
| Boxing Roadmap | `prod_TKgxoODHTfkQEF` | `brdmp` | $147 |
| 6-Week Challenge | `prod_TKqgLcTbkwLMlK` | `6wc` | $197 |
| Recordings Vault | `prod_TKqg9nRbK27CDg` | `rcv` | $67 |
| Lifetime BFFP | `prod_TKqgCP3kcRQ7Rw` | `ltbffp` | $147 |
| Lifetime All Courses | `prod_THtXlTjbNn8FXP` | `ltall_297` / `ltall_197` | $297 / $197 |
| 6-Week Membership | `prod_THvKZVW9MTpheP` | `6wm` | $97 |
| 1-on-1 Coaching | `prod_THuQf0h3DatQUL` | `coach1` | $397 |
| Coaching Recordings Vault | `prod_THtSgSl2rHdu8X` | `coach_archive` | $67 |
| Black Friday Challenge | `prod_TNwT73GrjCaz3r` | `bfc` | $97 |
| Black Friday Challenge VIP | `prod_TNwYt9qDOIofyA` | `bfc_vip` | $497 |
| Grades 2 & 3 | `prod_TmMdHvbqK2B4FR` | `grades23` | $200 |
| Membership (legacy quarterly) | `prod_TKqg25PDS8om6s` | `memq` | $297 |
| Membership (legacy 6-month) | `prod_TKqg25PDS8om6s` | `mem6` | $497 |
| Monthly Membership (alt product) | `prod_TibyCQmwHqluFk` | `mem_monthly` | $97/mo |

---

## Notes

- 92 archived products exist in Stripe (old iterations, test products, legacy offers)
- The codebase (`lib/products.ts`) is the authoritative source for which products/prices are used
- Multi-currency prices on archived products still work for checkout — archiving only hides them from the Stripe Dashboard product list
- Membership uses two different Stripe product IDs: `prod_TibyCQmwHqluFk` (monthly) and `prod_TKqg25PDS8om6s` (annual + legacy tiers)
