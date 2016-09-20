# Set encoding to utf-8
# encoding: UTF-8

#
# BigBlueButton open source conferencing system - http://www.bigbluebutton.org/
#
# Copyright (c) 2012 BigBlueButton Inc. and by respective authors (see below).
#
# This program is free software; you can redistribute it and/or modify it under the
# terms of the GNU Lesser General Public License as published by the Free Software
# Foundation; either version 3.0 of the License, or (at your option) any later
# version.
#
# BigBlueButton is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
# PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License along
# with BigBlueButton; if not, see <http://www.gnu.org/licenses/>.
#


require 'rubygems'
require 'nokogiri'

module BigBlueButton
  class Presentation
    # Get the presentations.
    def self.get_presentations(events_xml)
      BigBlueButton.logger.info("Task: Getting presentations from events")      
      presentations = []
      doc = Nokogiri::XML(File.open(events_xml))
      doc.xpath("//event[@eventname='SharePresentationEvent']").each do |presentation_event|
        presentations << presentation_event.xpath("presentationName").text
      end
      presentations
    end

    # Determine the number pages in a presentation.
    def self.get_number_of_pages_for(presentation_dir)
      BigBlueButton.logger.info("Task: Getting number of pages in presentation")      
      Dir.glob("#{presentation_dir}/*.swf").size
    end

    # Extract a page from a pdf file as a png image
    def self.extract_png_page_from_pdf(page_num, pdf_presentation, png_out, resize = '800x600')
      BigBlueButton.logger.info("Task: Extracting a page from pdf file as png image")
      temp_out = "#{File.dirname(png_out)}/temp-#{File.basename(png_out, '.png')}"
      command = "pdftocairo -png -f #{page_num} -l #{page_num} -r 300 -singlefile #{pdf_presentation} #{temp_out}"
      status = BigBlueButton.execute(command, false)
      temp_out += ".png"
      if status.success? and File.exist?(temp_out)
        # Resize to the requested size
        command = "convert #{temp_out} -resize #{resize} -quality 90 +dither -depth 8 -colors 256 #{png_out}"
        BigBlueButton.execute(command)
      else
        # If page extraction failed, generate a blank white image
        command = "convert -size #{resize} xc:white -quality 90 +dither -depth 8 -colors 256 #{png_out}"
        BigBlueButton.execute(command)
      end
    ensure
      FileUtils.rm_f(temp_out)
    end
    
    # Convert a pdf page to a png.
    def self.convert_pdf_to_png(pdf_page, png_out)
      self.extract_png_page_from_pdf(1, pdf_page, png_out, '800x600')
    end

    # Convert an image to a png
    def self.convert_image_to_png(image, png_image, resize = '800x600')
        BigBlueButton.logger.info("Task: Converting image to .png")      
        command = "convert #{image} -resize #{resize} -background white -flatten #{png_image}"
        BigBlueButton.execute(command)
    end

    # Get the presentation that will be used for preview.
    def self.get_presentation_for_preview(process_dir)
      events_xml = "#{process_dir}/events.xml"
      BigBlueButton.logger.info("Task: Getting presentation to be used for preview from events")
      presentation = {}
      doc = Nokogiri::XML(File.open(events_xml))
      doc.xpath("//event[@eventname='SharePresentationEvent']").each do |presentation_event|
        presentation["id"] = presentation_event.xpath("presentationName").text
        presentation["filename"] = presentation_event.xpath("originalFilename").text
        unless presentation_event.xpath("originalFilename").text == "default.pdf"
          # Gathers the text from the slide
          textfiles_dir = "#{process_dir}/presentation/#{presentation["id"]}/textfiles"
          if File.file?("#{textfiles_dir}/slide-1.txt")
            presentation["text"] = File.open("#{textfiles_dir}/slide-1.txt") {|f| f.readline}
            unless presentation["text"] == nil 
              presentation["text"] = presentation["text"].strip
            end
          end
          # Break because something else than default.pdf was found
          break
        end
      end
      presentation
    end
  end

  # Extract a page from a pdf file as a png image
  def self.extract_page_title_from_pdf(page_num, pdf_presentation)
  end
end
