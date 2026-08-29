-- Seed initial media assets
INSERT INTO public.media_assets (name, url, type, mime_type) VALUES
('hero-video', 'https://id-preview--ceef80ab-87ff-4ff0-ab08-1881b9920670.lovable.app/videos/hero.mp4', 'video', 'video/mp4'),
('services-video', 'https://id-preview--ceef80ab-87ff-4ff0-ab08-1881b9920670.lovable.app/videos/services.mp4', 'video', 'video/mp4'),
('craftsmanship-video', 'https://id-preview--ceef80ab-87ff-4ff0-ab08-1881b9920670.lovable.app/videos/craftsmanship.mp4', 'video', 'video/mp4');

-- Seed site settings
INSERT INTO public.site_settings (key, value) VALUES
('business_info', '{
  "name": "East Texas Handyman Services",
  "phone": "+1 (469) 678-6244",
  "email": "contact@ethhs.com",
  "address": "2505 Clinton St, Longview, TX 75604"
}'::jsonb),
('seo_defaults', '{
  "title": "East Texas Handyman Services | Longview, TX Home Repair",
  "description": "Trusted handyman in Longview, TX. Carpentry, drywall, painting, doors, flooring, fence & deck repair."
}'::jsonb);

-- Seed content blocks
INSERT INTO public.content_blocks (key, section, label, kind, data) VALUES
('hero_content', 'home', 'Hero Section', 'json', '{
  "eyebrow": "Longview, Texas · Home Repair & Maintenance",
  "title": "Honest, Reliable Handyman Work Across East Texas",
  "body": "East Texas Handyman Services handles the repairs, installations, and improvements that keep your home or rental property in top shape."
}'::jsonb),
('about_intro', 'about', 'About Introduction', 'json', '{
  "heading": "A Local Crew East Texas Homeowners Can Count On",
  "content": "East Texas Handyman Services is a trusted local handyman company serving Longview and the surrounding East Texas communities."
}'::jsonb);
