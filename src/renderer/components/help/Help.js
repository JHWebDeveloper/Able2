import React from 'react'
import Helmet from 'react-helmet'
import '../../css/help.css'
import Header from '../main/Header'
import { remote } from 'electron'

const Help = () => (
  <>
    <Helmet>
      <title>Able2 Help</title>
    </Helmet>
    <Header />
    <div className="help">
      <p>Version {remote.app.getVersion()}</p>
      <p>Able2 is a video downloader and processor designed to help get your links on air as fast and efficiently as possible.</p>

      <h2>Getting Started</h2>
      <h3>Download Videos from the Internet</h3>
      <p>To download a video from an internet video service, simply copy and paste the URL of the video in the text field at the top of the form and click the "Fetch Video" button below. The "Fetch Video" button will only be available when a valid URL is detected.</p>
      <p>To download from the web, Able2 makes use of youtube-dl, an open-source command line interface compatible with numerous online video services including but not limited to YouTube, Twitter, Facebook, Instagram, Vimeo, Twitch, Reddit, Tumblr, Flickr, and Dailymotion.</p>
      <h3>Upload Files from Your Computer</h3>
      <p>In addition to downloading, Able2 offers several video processing options. To use these features on a video or image already on your computer, drag and drop the file on in the indicated area. Alternatively, clicking on this area will display a file browser.</p>
      <p>You can select multiple videos/images for batch processing. A manually entered filename is required for batch processing.</p>
      <h3>Start a Screen Record</h3>
      <p>If you are unable to downloaded a video, Able2 has a built in screen recorder as a work around. Simply start the record and play the video. You should fullscreen if available.</p>
      <p>To start a screen record simply click the record button. The button will blink to indicate it's recording. To stop, somply click the button again.</p>
      <p>You can also record for a set ammount of time. Check the timecode selector below the record button and enter the desired duration. The Screen Recorder will automatically stop once the set duration has passed</p>
      <p>The Screen Recorder should only be used as a last resort. Always attempt to download the video first.</p>

      <h2>Video Info</h2>
      <p>Once a valid video has been loaded, a thumbnail and info card will display. The info displayed will vary between video services.</p>

      <h2>Download Options</h2>
      <p>Under the Info Card you will see several options. Let's walk through each of them.</p>
      <h3>File Name</h3>
      <p>Here you can specify the name for the exported file. This is the only option required for export.</p>
      <h3>Start and End Times</h3>
      <p>Here you can tell Able2 where to start and end the video it edit it down to a subclip.</p>
      <p>Watch your start and end inputs carefully. A start time longer than the video duration, or an end time earlier than the start time will result in a dud file.</p>
      <h3>Optimize Settings</h3>
      <p>Some services, YouTube in particular, will omit the audio from higher quality versions of the video and play it on top of audio from a lower quality source.</p>
      <h4>Optimize Video Quality</h4>
      <p>This option will download the highest video and audio sources seperately and mix them together if needed. This will take extra processing time.</p>
      <p>Unless the video is needed immediately, Optimize Video Quality should always be used.</p>
      <h4>Optimize Download Time</h4>
      <p>This option will download the highest quality video with audio already attached. This will save some processing time.</p>

      <h2>Formatting Options</h2>
      <h3>AR Correction</h3>
      <p>ARC correction is used to place a video or image that is not perfectly 16:9 inside a 16:9 frame.</p>
      <h4>Fill Frame</h4>
      <p>Fill Frame will scale and crop the video so that the edges completely fill a 16:9 frame. The video will be automatically centered within the crop.</p>
      <h4>Fit Inside Frame</h4>
      <p>Fit inside frame will scale the video to be entirely visible within a 16:9 frame adding filling the reminaing space with pillaring/letterboxing. With this option selected you will be able to choose a background to fill up this extra space.</p>
      <h3>Background</h3>
      <h4>Animate Blue/Grey</h4>
      <p>Puts the video on top of one of the standard Ch9 backgrounds.</p>
      <h4>TV/Laptop Backgrounds</h4>
      <p>Puts the video inside a decorative Ch9 TV or Laptop frame.</p>
      <p>Video will be zoomed to fill the dimensions of the TV or Laptop.</p>
      <p>These options are only available for videos, not images.</p>
      <h4>Transparent</h4>
      <p>Puts the video over an transparent background and exports with an alpha channel. Due to the alpha channel, this option takes the longest to process.</p>
      <h4>Black</h4>
      <p>Simply puts the video over a solid black background.</p>
      <h3>Source</h3>
      <p>Adds a Ch9 source overlay to the video.</p>
      <p>If AR Correction is set to None, the source will only be added to the video if it has a 16:9 aspect ratio. For all other aspect ratios, the source overlay will export as a separate .png file.</p>
      <h2>Transform Options</h2>
      <h3>Rotate</h3>
      <p>For correcting sideways video.</p>
      <h3>Flip</h3>
      <p>For correcting inverted and/or upside down video.</p>
      <p>Selecting Horizontally and Vertically together will have the same effect as rotating the video 180°.</p>

      <h2>Save Shortcuts</h2>
      <p>A list of selectable directories where Able2 save the video.</p>
      <p>The save shortcuts are customizable. See the Preferences section for more details.</p>
      <p>If no shortcuts are selected or present, you will be prompted to choose a location upon clicking the Download/Save button.</p>

      <h2>Download/Save Video</h2>
      <p>Click "Download" (for URLs) or "Save" (for files) to begin processing the video. A progress bar will display Able2's current status in the download and render process.</p>
      <p>The video will be exported as an h.264 encoded .mp4 unless the transparent background option is selected. In that case the video will export as an Apple ProRes 4444 encoded .mov.</p>

      <h2>Preferences</h2>
      <p>To access the Preferences window select Edit > Preferences (windows) or Able2 > Preferences (mac)</p>
      <h3>Render Output Resolution</h3>
      <p>This allows you to set whether Able2 renders in 1080 or 720.</p>
      <p>This only effects processed videos. Simply downloading the video as is will retain the original resolution</p>
      <h3>Save Shortcuts</h3>
      <p>Here you can customize the Save Shortcuts on the main form.</p>
      <p>Each shortcut has a directory selector, a display label and a check box to indicate whether it should be selected by default when the app is started. The shortcuts can be added, deleted or rearranged.</p>
    </div>
  </>
)

export default Help
